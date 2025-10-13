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
		const { accountIdFrom, accountIdTo, amountFrom, rate, description, date } =
			body;

		if (!accountIdFrom || !accountIdTo || !amountFrom) {
			return NextResponse.json(
				{ error: 'Некорректные данные' },
				{ status: 400 }
			);
		}

		if (accountIdFrom === accountIdTo) {
			return NextResponse.json(
				{ error: 'Счета должны быть разными' },
				{ status: 400 }
			);
		}

		// ищем текущую транзакцию
		const existing = await prisma.transaction.findUnique({
			where: { id },
		});

		if (!existing) {
			return NextResponse.json(
				{ error: 'Транзакция не найдена' },
				{ status: 404 }
			);
		}

		if (existing.userId !== userId) {
			return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });
		}

		if (existing.type !== 'TRANSFER') {
			return NextResponse.json(
				{ error: 'Транзакция не является трансфером' },
				{ status: 400 }
			);
		}

		// откатываем старые изменения баланса
		if (existing.accountIdFrom && existing.amountFrom) {
			await prisma.account.update({
				where: { id: existing.accountIdFrom },
				data: { balance: { increment: existing.amountFrom } },
			});
		}
		if (existing.accountIdTo && existing.amountTo) {
			await prisma.account.update({
				where: { id: existing.accountIdTo },
				data: { balance: { decrement: existing.amountTo } },
			});
		}

		// валидируем новые аккаунты
		const accountFrom = await prisma.account.findUnique({
			where: { id: accountIdFrom },
			include: { currency: true },
		});
		const accountTo = await prisma.account.findUnique({
			where: { id: accountIdTo },
			include: { currency: true },
		});

		if (!accountFrom || !accountTo) {
			return NextResponse.json({ error: 'Счета не найдены' }, { status: 404 });
		}

		let finalRate = 1;
		if (accountFrom.currencyId !== accountTo.currencyId) {
			if (!rate || rate <= 0) {
				return NextResponse.json(
					{ error: 'Не указан курс для разных валют' },
					{ status: 400 }
				);
			}
			finalRate = rate;
		}

		const amountTo = amountFrom * finalRate;

		// обновляем транзакцию
		const updated = await prisma.transaction.update({
			where: { id },
			data: {
				accountIdFrom,
				accountIdTo,
				amountFrom,
				amountTo,
				description,
				date: new Date(date),
			},
		});

		// применяем новые изменения к балансам
		await prisma.account.update({
			where: { id: accountIdFrom },
			data: { balance: { decrement: amountFrom } },
		});

		await prisma.account.update({
			where: { id: accountIdTo },
			data: { balance: { increment: amountTo } },
		});

		revalidatePath('/');

		return NextResponse.json(updated);
	} catch (error) {
		console.error('Ошибка при обновлении трансфера:', error);
		return NextResponse.json(
			{ error: 'Ошибка при обновлении трансфера' },
			{ status: 500 }
		);
	}
}
