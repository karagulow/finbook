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

		const decoded = verify(token, JWT_SECRET) as { userId: string };
		const userId = decoded.userId;

		const body = await req.json();
		const { name, amount, currencyId } = body;

		const account = await prisma.account.findFirst({
			where: { id, userId },
		});

		if (!account) {
			return NextResponse.json(
				{ error: 'Счёт не найден или нет доступа' },
				{ status: 404 }
			);
		}

		const updated = await prisma.account.update({
			where: { id },
			data: {
				name,
				balance: amount,
				currencyId,
			},
		});

		revalidatePath('/');

		return NextResponse.json(updated);
	} catch (error) {
		console.error('Ошибка при обновлении счёта:', error);
		return NextResponse.json(
			{ error: 'Failed to update account' },
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

		const decoded = verify(token, JWT_SECRET) as { userId: string };
		const userId = decoded.userId;

		const account = await prisma.account.findUnique({
			where: { id },
		});

		if (!account) {
			return NextResponse.json({ error: 'Счёт не найден' }, { status: 404 });
		}

		if (account.userId !== userId) {
			return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });
		}

		await prisma.account.delete({
			where: { id },
		});

		revalidatePath('/');

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Не удалось удалить счёт' },
			{ status: 500 }
		);
	}
}
