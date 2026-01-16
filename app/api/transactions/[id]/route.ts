import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/prisma/prisma-client';
import { verify } from 'jsonwebtoken';
import { revalidatePath } from 'next/cache';

const JWT_SECRET = process.env.JWT_SECRET!;

type RouteContext = {
	params: Promise<{ id: string }>;
};

export async function PUT(req: Request, context: RouteContext) {
	const { id } = await context.params;

	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;

		if (!token) {
			return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
		}

		let userId: string;
		try {
			const decoded = verify(token, JWT_SECRET) as { userId: string };
			userId = decoded.userId;
		} catch {
			return NextResponse.json(
				{ error: 'Токен недействителен или истёк' },
				{ status: 401 }
			);
		}

		const transaction = await prisma.transaction.findUnique({
			where: { id },
		});

		if (!transaction) {
			return NextResponse.json(
				{ error: 'Транзакция не найдена' },
				{ status: 404 }
			);
		}

		if (transaction.userId !== userId) {
			return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });
		}

		const data = await req.json();

		const updated = await prisma.transaction.update({
			where: { id },
			data: {
				type: data.type,
				date: data.date,
				description: data.description,
				accountId: data.accountId || null,
				categoryId: data.categoryId || null,
				subcategoryId: data.subcategoryId || null,
				amount: data.amount,
			},
		});

		revalidatePath('/');

		return NextResponse.json(updated);
	} catch (error) {
		console.error('Ошибка при обновлении транзакции:', error);
		return NextResponse.json(
			{ error: 'Не удалось обновить транзакцию' },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: Request, context: RouteContext) {
	const { id } = await context.params;

	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;

		if (!token) {
			return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
		}

		let userId: string;
		try {
			const decoded = verify(token, JWT_SECRET) as { userId: string };
			userId = decoded.userId;
		} catch {
			return NextResponse.json(
				{ error: 'Токен недействителен или истёк' },
				{ status: 401 }
			);
		}

		const transaction = await prisma.transaction.findUnique({
			where: { id },
		});

		if (!transaction) {
			return NextResponse.json(
				{ error: 'Транзакция не найдена' },
				{ status: 404 }
			);
		}

		if (transaction.userId !== userId) {
			return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });
		}

		await prisma.transaction.delete({
			where: { id },
		});

		revalidatePath('/');

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Ошибка при удалении транзакции:', error);
		return NextResponse.json(
			{ error: 'Не удалось удалить транзакцию' },
			{ status: 500 }
		);
	}
}
