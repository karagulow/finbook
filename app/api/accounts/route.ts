import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/prisma/prisma-client';
import { verify } from 'jsonwebtoken';
import { revalidatePath } from 'next/cache';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;

		if (!token) {
			throw new Error('Не авторизован');
		}

		const decoded = verify(token, JWT_SECRET) as { userId: string };
		const userId = decoded.userId;

		const accounts = await prisma.account.findMany({
			where: { userId },
			orderBy: { name: 'asc' },
		});

		return NextResponse.json(accounts);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: 'Ошибка при получении счетов' },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;

		if (!token) {
			throw new Error('Не авторизован');
		}

		const decoded = verify(token, JWT_SECRET) as { userId: string };
		const userId = decoded.userId;

		const body = await req.json();
		const { name, amount, currencyId } = body;

		const account = await prisma.account.create({
			data: {
				name,
				balance: amount,
				currencyId,
				userId,
			},
		});

		revalidatePath('/');

		return NextResponse.json(account);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Failed to create account' },
			{ status: 500 }
		);
	}
}
