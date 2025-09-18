'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/prisma/prisma-client';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getTransactionsByMonth(accountId?: string | null) {
	const cookieStore = await cookies();
	const token = cookieStore.get('authToken')?.value;

	if (!token) {
		throw new Error('Не авторизован');
	}

	const decoded = verify(token, JWT_SECRET) as { userId: string };
	const userId = decoded.userId;

	const now = new Date();
	const y = now.getFullYear();
	const m = now.getMonth() + 1;

	const startDate = new Date(y, m - 1, 1);
	const endDate = new Date(y, m, 0, 23, 59, 59);

	// Берём пользователя с валютой
	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: { currency: true },
	});
	if (!user) throw new Error('Пользователь не найден');

	const transactions = await prisma.transaction.findMany({
		where: {
			userId,
			date: { gte: startDate, lte: endDate },
			type: { in: ['INCOME', 'EXPENSE'] },
			...(accountId && accountId !== 'all' ? { accountId } : {}),
		},
		include: {
			category: true,
			account: { include: { currency: true } },
		},
	});

	// Конвертируем суммы в валюту пользователя
	const converted = [];
	for (const tx of transactions) {
		if (!tx.amount) continue;

		let amountInUserCurrency = tx.amount;

		if (tx.account?.currencyId && tx.account.currencyId !== user.currencyId) {
			// ищем курс "из валюты счета в валюту пользователя"
			let rateRecord = await prisma.exchangeRate.findFirst({
				where: { fromId: tx.account.currencyId, toId: user.currencyId },
				orderBy: { date: 'desc' },
			});

			if (rateRecord) {
				amountInUserCurrency = tx.amount * rateRecord.rate;
			} else {
				// ищем обратный курс
				rateRecord = await prisma.exchangeRate.findFirst({
					where: { fromId: user.currencyId, toId: tx.account.currencyId },
					orderBy: { date: 'desc' },
				});

				if (rateRecord) {
					amountInUserCurrency = tx.amount / rateRecord.rate;
				} else {
					console.warn(
						`[Transactions API] Нет курса для ${tx.account.currency.code} → ${user.currency.code}`
					);
				}
			}
		}

		converted.push({
			...tx,
			amountInUserCurrency,
		});
	}

	return converted;
}
