import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;

		if (!token) {
			return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
		}

		const decoded = verify(token, JWT_SECRET) as { userId: string };
		const userId = decoded.userId;
		const categoryId = params.id;

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
