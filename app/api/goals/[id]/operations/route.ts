import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/prisma/prisma-client';

const JWT_SECRET = process.env.JWT_SECRET!;

type RouteContext = {
	params: Promise<{ id: string }>;
};

const roundMoney = (value: number) => Math.round(value * 100) / 100;

export async function POST(req: NextRequest, context: RouteContext) {
	const { id } = await context.params;

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
				{ status: 401 },
			);
		}

		const body = await req.json();
		const { type, amount, date, description } = body;

		if (type !== 'DEPOSIT' && type !== 'WITHDRAW') {
			return NextResponse.json(
				{ message: 'Укажите тип операции' },
				{ status: 400 },
			);
		}

		const operationAmount = roundMoney(Number(amount));
		const operationDate = new Date(date);
		const trimmedDescription =
			typeof description === 'string' ? description.trim() : '';

		if (!Number.isFinite(operationAmount) || operationAmount <= 0) {
			return NextResponse.json(
				{ message: 'Сумма должна быть больше 0' },
				{ status: 400 },
			);
		}

		if (Number.isNaN(operationDate.getTime())) {
			return NextResponse.json({ message: 'Укажите дату' }, { status: 400 });
		}

		const goal = await prisma.goal.findFirst({
			where: { id, userId },
			select: { id: true, saved_amount: true },
		});

		if (!goal) {
			return NextResponse.json({ message: 'Цель не найдена' }, { status: 404 });
		}

		const savedAmount = roundMoney(goal.saved_amount);

		if (type === 'WITHDRAW' && operationAmount > savedAmount) {
			return NextResponse.json(
				{ message: 'Сумма больше доступной для снятия' },
				{ status: 400 },
			);
		}

		const nextSavedAmount = roundMoney(
			type === 'DEPOSIT'
				? savedAmount + operationAmount
				: savedAmount - operationAmount,
		);

		const operation = await prisma.$transaction(async tx => {
			const created = await tx.transaction.create({
				data: {
					type: 'GOAL',
					goalType: type,
					amount: operationAmount,
					date: operationDate,
					description: trimmedDescription || null,
					goalId: goal.id,
					userId,
				},
			});

			await tx.goal.update({
				where: { id: goal.id },
				data: { saved_amount: nextSavedAmount },
			});

			return created;
		});

		return NextResponse.json(
			{
				id: operation.id,
				amount: operation.amount,
				type,
				date: operation.date.toISOString(),
				savedAmount: nextSavedAmount,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
