import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/prisma/prisma-client';
import { verify } from 'jsonwebtoken';
import { revalidatePath } from 'next/cache';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;

		if (!token) {
			return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
		}

		const decoded = verify(token, JWT_SECRET) as { userId: string };
		const userId = decoded.userId;

		const { searchParams } = new URL(req.url);
		const limit = parseInt(searchParams.get('limit') || '25', 10);
		const cursor = searchParams.get('cursor');

		const transactions = await prisma.transaction.findMany({
			where: { userId },
			orderBy: { date: 'desc' },
			take: limit + 1,
			...(cursor
				? {
						skip: 0,
						cursor: { id: cursor },
				  }
				: {}),
			include: {
				account: {
					include: {
						currency: {
							select: {
								id: true,
								code: true,
								symbol: true,
							},
						},
					},
				},
				category: true,
				subcategory: true,
				accountFrom: {
					include: {
						currency: {
							select: {
								id: true,
								code: true,
								symbol: true,
							},
						},
					},
				},
				accountTo: {
					include: {
						currency: {
							select: {
								id: true,
								code: true,
								symbol: true,
							},
						},
					},
				},
				goal: true,
				debt: true,
			},
		});

		let nextCursor: string | null = null;
		if (transactions.length > limit) {
			const nextItem = transactions.pop();
			nextCursor = nextItem?.id ?? null;
		}

		return NextResponse.json({
			items: transactions,
			nextCursor,
		});
	} catch (error) {
		console.error('Ошибка при получении транзакций:', error);
		return NextResponse.json(
			{ error: 'Ошибка при получении транзакций' },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;

		if (!token) {
			return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
		}

		const decoded = verify(token, JWT_SECRET) as { userId: string };
		const userId = decoded.userId;

		const body = await req.json();
		const {
			amount,
			accountId,
			categoryId,
			subcategoryId,
			description,
			date,
			type,
		} = body;

		if (!amount || !accountId || !categoryId) {
			return NextResponse.json(
				{ error: 'Некорректные данные' },
				{ status: 400 }
			);
		}

		const transaction = await prisma.transaction.create({
			data: {
				type,
				amount,
				accountId,
				categoryId,
				subcategoryId,
				description,
				date: new Date(date).toISOString(),
				userId,
			},
		});

		if (type === 'INCOME') {
			await prisma.account.update({
				where: { id: accountId },
				data: { balance: { increment: amount } },
			});
		} else if (type === 'EXPENSE') {
			await prisma.account.update({
				where: { id: accountId },
				data: { balance: { decrement: amount } },
			});
		}

		revalidatePath('/');

		return NextResponse.json(transaction);
	} catch (error) {
		console.error('Ошибка при добавлении транзакции:', error);
		return NextResponse.json(
			{ error: 'Ошибка при добавлении транзакции' },
			{ status: 500 }
		);
	}
}
