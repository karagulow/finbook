import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/prisma/prisma-client';

const JWT_SECRET = process.env.JWT_SECRET!;

type RouteContext = {
	params: Promise<{ id: string; operationId: string }>;
};

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const getUserId = async (): Promise<
	{ userId: string } | { error: NextResponse }
> => {
	const cookieStore = await cookies();
	const token = cookieStore.get('authToken')?.value;

	if (!token) {
		return {
			error: NextResponse.json({ message: 'Не авторизован' }, { status: 401 }),
		};
	}

	try {
		const decoded = verify(token, JWT_SECRET) as { userId: string };
		return { userId: decoded.userId };
	} catch {
		return {
			error: NextResponse.json(
				{ message: 'Токен недействителен или истёк' },
				{ status: 401 },
			),
		};
	}
};

const savedAmountAfterChange = (
	savedAmount: number,
	goalType: 'DEPOSIT' | 'WITHDRAW',
	previousAmount: number,
	nextAmount: number,
) => {
	const delta =
		goalType === 'DEPOSIT'
			? nextAmount - previousAmount
			: previousAmount - nextAmount;

	return roundMoney(savedAmount + delta);
};

export async function PUT(req: NextRequest, context: RouteContext) {
	const { id, operationId } = await context.params;

	try {
		const auth = await getUserId();
		if ('error' in auth) return auth.error;
		const { userId } = auth;

		const body = await req.json();
		const { amount, date, description } = body;

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

		const operation = await prisma.transaction.findFirst({
			where: {
				id: operationId,
				goalId: id,
				userId,
				type: 'GOAL',
			},
			select: {
				id: true,
				amount: true,
				goalType: true,
				goal: {
					select: { id: true, saved_amount: true },
				},
			},
		});

		if (
			!operation?.goal ||
			operation.amount == null ||
			(operation.goalType !== 'DEPOSIT' && operation.goalType !== 'WITHDRAW')
		) {
			return NextResponse.json(
				{ message: 'Операция не найдена' },
				{ status: 404 },
			);
		}

		const goalId = operation.goal.id;
		const previousAmount = roundMoney(operation.amount);
		const nextSavedAmount = savedAmountAfterChange(
			roundMoney(operation.goal.saved_amount),
			operation.goalType,
			previousAmount,
			operationAmount,
		);

		if (nextSavedAmount < 0) {
			return NextResponse.json(
				{
					message:
						operation.goalType === 'WITHDRAW'
							? 'Сумма больше доступной для снятия'
							: 'Часть суммы уже снята с цели',
				},
				{ status: 400 },
			);
		}

		const updated = await prisma.$transaction(async tx => {
			const saved = await tx.transaction.update({
				where: { id: operation.id },
				data: {
					amount: operationAmount,
					date: operationDate,
					description: trimmedDescription || null,
				},
			});

			await tx.goal.update({
				where: { id: goalId },
				data: { saved_amount: nextSavedAmount },
			});

			return saved;
		});

		return NextResponse.json({
			id: updated.id,
			amount: updated.amount,
			type: operation.goalType,
			date: updated.date.toISOString(),
			description: updated.description,
			savedAmount: nextSavedAmount,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
	const { id, operationId } = await context.params;

	try {
		const auth = await getUserId();
		if ('error' in auth) return auth.error;
		const { userId } = auth;

		const operation = await prisma.transaction.findFirst({
			where: {
				id: operationId,
				goalId: id,
				userId,
				type: 'GOAL',
			},
			select: {
				id: true,
				amount: true,
				goalType: true,
				goal: {
					select: { id: true, saved_amount: true },
				},
			},
		});

		if (
			!operation?.goal ||
			operation.amount == null ||
			(operation.goalType !== 'DEPOSIT' && operation.goalType !== 'WITHDRAW')
		) {
			return NextResponse.json(
				{ message: 'Операция не найдена' },
				{ status: 404 },
			);
		}

		const goalId = operation.goal.id;
		const previousAmount = roundMoney(operation.amount);
		const nextSavedAmount = savedAmountAfterChange(
			roundMoney(operation.goal.saved_amount),
			operation.goalType,
			previousAmount,
			0,
		);

		if (nextSavedAmount < 0) {
			return NextResponse.json(
				{ message: 'Часть суммы уже снята с цели' },
				{ status: 400 },
			);
		}

		await prisma.$transaction(async tx => {
			await tx.transaction.delete({
				where: { id: operation.id },
			});

			await tx.goal.update({
				where: { id: goalId },
				data: { saved_amount: nextSavedAmount },
			});
		});

		return NextResponse.json({ success: true, savedAmount: nextSavedAmount });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
