'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/prisma/prisma-client';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getAccounts() {
	const cookieStore = await cookies();
	const token = cookieStore.get('authToken')?.value;

	if (!token) {
		throw new Error('Не авторизован');
	}

	const decoded = verify(token, JWT_SECRET) as { userId: string };
	const userId = decoded.userId;

	const accounts = await prisma.account.findMany({
		where: { userId },
		include: { currency: true },
	});

	return accounts.map(acc => ({
		id: acc.id,
		name: acc.name,
		balance: acc.balance,
		currency: acc.currency.symbol ?? acc.currency.code,
		currencyId: acc.currencyId,
	}));
}
