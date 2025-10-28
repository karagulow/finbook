import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

type RouteContext = {
	params: Promise<{ id: string }>;
};

export async function DELETE(req: Request, context: RouteContext) {
	const { id } = await context.params;

	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;

		if (!token) {
			return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
		}

		const decoded = verify(token, JWT_SECRET) as { userId: string };
		const userId = decoded.userId;
		const categoryId = id;

		const category = await prisma.category.findUnique({
			where: { id: categoryId },
			include: { subcategories: true, transactions: true },
		});

		if (!category || category.userId !== userId) {
			return NextResponse.json(
				{ message: 'Категория не найдена или нет доступа' },
				{ status: 404 }
			);
		}

		await prisma.$transaction([
			prisma.transaction.deleteMany({
				where: { categoryId },
			}),
			prisma.subcategory.deleteMany({
				where: { categoryId },
			}),
			prisma.category.delete({
				where: { id: categoryId },
			}),
		]);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Ошибка при удалении категории:', error);
		return NextResponse.json(
			{ message: 'Ошибка при удалении категории' },
			{ status: 500 }
		);
	}
}

export async function PUT(req: Request, context: RouteContext) {
	const { id } = await context.params;

	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;

		if (!token) {
			return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
		}

		const decoded = verify(token, JWT_SECRET) as { userId: string };
		const userId = decoded.userId;
		const categoryId = id;

		const body = await req.json();
		const { name, type, icon, color, subcategories } = body;

		const category = await prisma.category.findUnique({
			where: { id: categoryId },
			include: { subcategories: true },
		});

		if (!category || category.userId !== userId) {
			return NextResponse.json(
				{ message: 'Категория не найдена или нет доступа' },
				{ status: 404 }
			);
		}

		const validSubcategories =
			Array.isArray(subcategories) && subcategories.length > 0
				? subcategories
						.map((s: string) => s.trim())
						.filter((s: string) => s.length > 0)
				: [];

		const existingSubNames = category.subcategories.map(s => s.name);

		const subsToDelete = existingSubNames.filter(
			name => !validSubcategories.includes(name)
		);
		const subsToCreate = validSubcategories.filter(
			name => !existingSubNames.includes(name)
		);

		const tx = [
			prisma.category.update({
				where: { id: categoryId },
				data: { name, type, icon, color },
			}),
			prisma.subcategory.deleteMany({
				where: { categoryId, name: { in: subsToDelete } },
			}),
		];

		if (subsToCreate.length > 0) {
			tx.push(
				prisma.subcategory.createMany({
					data: subsToCreate.map(name => ({ name, categoryId })),
				})
			);
		}

		await prisma.$transaction(tx);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Ошибка при редактировании категории:', error);
		return NextResponse.json(
			{ message: 'Ошибка при редактировании категории' },
			{ status: 500 }
		);
	}
}
