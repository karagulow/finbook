import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;

		if (!token) {
			throw new Error('Не авторизован');
		}

		const decoded = verify(token, JWT_SECRET) as { userId: string };
		const userId = decoded.userId;

		const categories = await prisma.category.findMany({
			where: { userId },
			include: {
				subcategories: true,
			},
			orderBy: {
				name: 'asc',
			},
		});

		return NextResponse.json(categories);
	} catch (error: any) {
		console.error('Ошибка при получении категорий:', error);
		return NextResponse.json(
			{ message: 'Ошибка при получении категорий' },
			{ status: 500 }
		);
	}
}
