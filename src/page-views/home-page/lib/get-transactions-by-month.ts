'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/prisma/prisma-client';
import { verify } from 'jsonwebtoken';
import { DateTime } from 'luxon';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getTransactionsByMonth({
	accountId,
	timeZone,
}: {
	accountId?: string | null;
	timeZone: string;
}) {
	const cookieStore = await cookies();
	const token = cookieStore.get('authToken')?.value;

	if (!token) {
		throw new Error('Не авторизован');
	}

	const decoded = verify(token, JWT_SECRET) as { userId: string };
	const userId = decoded.userId;

	const now = DateTime.now().setZone(timeZone);

	if (!now.isValid) {
		throw new Error('Invalid timezone');
	}

	const startDateUtc = now.startOf('month').toUTC().toJSDate();
	const endDateUtc = now.endOf('month').toUTC().toJSDate();

	// Берём пользователя с валютой
	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: { currency: true },
	});
	if (!user) throw new Error('Пользователь не найден');

	const transactions = await prisma.transaction.findMany({
		where: {
			userId,
			date: { gte: startDateUtc, lte: endDateUtc },
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
