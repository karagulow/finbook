import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
	try {
		const token = req.cookies.get('authToken')?.value;
		if (!token) {
			return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
		}

		const decoded = verify(token, JWT_SECRET) as { userId: string };

		const fullUser = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				email: true,
				currency: {
					select: {
						id: true,
						name: true,
						code: true,
						symbol: true,
					},
				},
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!fullUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json(fullUser);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		console.error('Неизвестная ошибка', error);
		return NextResponse.json({ error: 'Неизвестная ошибка' }, { status: 500 });
	}
}

export async function DELETE() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;

		if (!token) {
			return NextResponse.json({ error: 'Неавторизован' }, { status: 401 });
		}

		const decoded = verify(token, JWT_SECRET) as { userId: string };
		const userId = decoded.userId;

		await prisma.transaction.deleteMany({ where: { userId } });
		await prisma.account.deleteMany({ where: { userId } });
		await prisma.goal.deleteMany({ where: { userId } });
		await prisma.debt.deleteMany({ where: { userId } });
		await prisma.subcategory.deleteMany({
			where: { category: { userId } },
		});
		await prisma.category.deleteMany({ where: { userId } });

		await prisma.user.delete({ where: { id: userId } });

		cookieStore.delete('authToken');
		cookieStore.delete('refreshToken');
		cookieStore.delete('userEmail');

		return NextResponse.json({ message: 'Пользователь успешно удалён' });
	} catch (error) {
		console.error('Ошибка при удалении пользователя:', error);
		return NextResponse.json(
			{ error: 'Ошибка при удалении пользователя' },
			{ status: 500 }
		);
	}
}
