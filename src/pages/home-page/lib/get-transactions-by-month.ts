'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/prisma/prisma-client';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getTransactionsByMonth() {
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

	const transactions = await prisma.transaction.findMany({
		where: {
			userId,
			date: {
				gte: startDate,
				lte: endDate,
			},
			type: { in: ['INCOME', 'EXPENSE'] },
		},
		include: {
			category: true,
		},
	});

	return transactions;
}
