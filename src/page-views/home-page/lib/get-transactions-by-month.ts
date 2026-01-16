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

	let userId: string;
	try {
		const decoded = verify(token, JWT_SECRET) as { userId: string };
		userId = decoded.userId;
	} catch {
		throw new Error('Токен недействителен или истёк');
	}

	const now = DateTime.now().setZone(timeZone);

	if (!now.isValid) {
		throw new Error('Invalid timezone');
	}

	const startDate = now.startOf('month').toUTC().toJSDate();
	const endDate = now.endOf('month').toUTC().toJSDate();

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

	const converted = [];
	for (const tx of transactions) {
		if (!tx.amount) continue;

		let amountInUserCurrency = tx.amount;

		if (tx.account?.currencyId && tx.account.currencyId !== user.currencyId) {
			let rateRecord = await prisma.exchangeRate.findFirst({
				where: { fromId: tx.account.currencyId, toId: user.currencyId },
				orderBy: { date: 'desc' },
			});

			if (rateRecord) {
				amountInUserCurrency = tx.amount * rateRecord.rate;
			} else {
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
