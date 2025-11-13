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

		// Если токена нет — 401
		if (!token) {
			return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
		}

		let userId: string;
		try {
			const decoded = verify(token, JWT_SECRET) as { userId: string };
			userId = decoded.userId;
		} catch {
			// Если токен недействителен или истёк — тоже 401
			return NextResponse.json(
				{ message: 'Токен недействителен или истёк' },
				{ status: 401 }
			);
		}

		const accounts = await prisma.account.findMany({
			where: { userId },
			orderBy: { order: 'asc' },
		});

		return NextResponse.json(accounts);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;

		if (!token) {
			return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
		}

		let userId: string;
		try {
			const decoded = verify(token, JWT_SECRET) as { userId: string };
			userId = decoded.userId;
		} catch {
			return NextResponse.json(
				{ message: 'Токен недействителен или истёк' },
				{ status: 401 }
			);
		}

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
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
