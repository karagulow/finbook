import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
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

export async function POST(req: NextRequest) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;

		if (!token) {
			return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
		}

		const decoded = verify(token, JWT_SECRET) as { userId: string };
		const userId = decoded.userId;

		const body = await req.json();
		const { name, type, icon, color, subcategories } = body;

		if (!name || !type || !icon || !color) {
			return NextResponse.json(
				{ message: 'Необходимо указать name, type, icon и color' },
				{ status: 400 }
			);
		}

		const existingCategory = await prisma.category.findFirst({
			where: { userId, name },
		});

		if (existingCategory) {
			return NextResponse.json(
				{ message: 'Категория с таким названием уже существует' },
				{ status: 409 }
			);
		}

		const newCategory = await prisma.category.create({
			data: {
				name,
				type,
				icon,
				color,
				userId,
				subcategories: subcategories?.length
					? {
							create: subcategories.map((sub: string) => ({
								name: sub,
							})),
					  }
					: undefined,
			},
			include: { subcategories: true },
		});

		return NextResponse.json(newCategory, { status: 201 });
	} catch (error) {
		console.error('Ошибка при создании категории:', error);
		return NextResponse.json(
			{ message: 'Ошибка при создании категории' },
			{ status: 500 }
		);
	}
}
