import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/prisma/prisma-client';
import { cashDelta, roundMoney } from '../../lib/cash-delta';

const JWT_SECRET = process.env.JWT_SECRET!;

type RouteContext = {
	params: Promise<{ id: string }>;
};

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

		const debt = await prisma.debt.findFirst({
			where: { id, userId },
			select: {
				id: true,
				type: true,
				saved_amount: true,
				target_amount: true,
				accountId: true,
			},
		});

		if (!debt) {
			return NextResponse.json({ message: 'Долг не найден' }, { status: 404 });
		}

		if (!debt.accountId) {
			return NextResponse.json(
				{ message: 'У долга не выбран счёт' },
				{ status: 400 },
			);
		}

		const account = await prisma.account.findFirst({
			where: { id: debt.accountId, userId },
			select: { id: true },
		});

		if (!account) {
			return NextResponse.json({ message: 'Счёт не найден' }, { status: 404 });
		}

		const savedAmount = roundMoney(debt.saved_amount);
		const targetAmount = roundMoney(debt.target_amount);
		const remaining = roundMoney(Math.max(0, targetAmount - savedAmount));

		if (operationAmount > remaining + 0.001) {
			return NextResponse.json(
				{ message: 'Сумма больше остатка долга' },
				{ status: 400 },
			);
		}

		const nextSavedAmount = roundMoney(savedAmount + operationAmount);
		const paid = nextSavedAmount + 0.001 >= targetAmount;

		const operation = await prisma.$transaction(async tx => {
			const created = await tx.transaction.create({
				data: {
					type: 'DEBT',
					debtAction: 'REPAY',
					amount: operationAmount,
					date: operationDate,
					description: trimmedDescription || null,
					accountId: account.id,
					debtId: debt.id,
					userId,
				},
			});

			await tx.debt.update({
				where: { id: debt.id },
				data: { saved_amount: nextSavedAmount, paid },
			});

			await tx.account.update({
				where: { id: account.id },
				data: {
					balance: {
						increment: cashDelta(debt.type, 'REPAY', operationAmount),
					},
				},
			});

			return created;
		});

		return NextResponse.json(
			{
				id: operation.id,
				amount: operation.amount,
				date: operation.date.toISOString(),
				description: operation.description,
				savedAmount: nextSavedAmount,
				paid,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
