'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/prisma/prisma-client';
import { verify } from 'jsonwebtoken';
import { DateTime } from 'luxon';

const JWT_SECRET = process.env.JWT_SECRET!;

async function getUserId() {
	const cookieStore = await cookies();
	const token = cookieStore.get('authToken')?.value;

	if (!token) {
		throw new Error('Не авторизован');
	}

	try {
		const decoded = verify(token, JWT_SECRET) as { userId: string };
		return decoded.userId;
	} catch {
		throw new Error('Токен недействителен или истёк');
	}
}

export async function getAnalyticsYears({
	accountId,
	timeZone,
}: {
	accountId?: string | null;
	timeZone: string;
}) {
	const userId = await getUserId();
	const now = DateTime.now().setZone(timeZone);

	if (!now.isValid) {
		throw new Error('Invalid timezone');
	}

	const earliest = await prisma.transaction.findFirst({
		where: {
			userId,
			type: { in: ['INCOME', 'EXPENSE'] },
			amount: { not: 0 },
			...(accountId && accountId !== 'all' ? { accountId } : {}),
		},
		orderBy: { date: 'asc' },
		select: { date: true },
	});

	const currentYear = now.year;
	const firstYear = earliest
		? DateTime.fromJSDate(earliest.date).setZone(timeZone).year
		: currentYear;
	const startYear = Math.min(firstYear, currentYear);

	return Array.from(
		{ length: currentYear - startYear + 1 },
		(_, index) => currentYear - index,
	);
}

export async function getTransactionsByYear({
	accountId,
	timeZone,
	year,
}: {
	accountId?: string | null;
	timeZone: string;
	year: number;
}) {
	const userId = await getUserId();

	if (!Number.isInteger(year) || year < 1900 || year > 2200) {
		throw new Error('Некорректный год');
	}

	const start = DateTime.fromObject(
		{ year, month: 1, day: 1 },
		{ zone: timeZone },
	);

	if (!start.isValid) {
		throw new Error('Invalid timezone');
	}

	const startDate = start.startOf('day').toUTC().toJSDate();
	const endDate = start.endOf('year').toUTC().toJSDate();

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
