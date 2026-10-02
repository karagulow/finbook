import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/prisma/prisma-client';
import { cashDelta, roundMoney } from '../lib/cash-delta';

const JWT_SECRET = process.env.JWT_SECRET!;

type RouteContext = {
	params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, context: RouteContext) {
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

		const debt = await prisma.debt.findFirst({
			where: { id, userId },
			select: { id: true, type: true, saved_amount: true },
		});

		if (!debt) {
			return NextResponse.json({ message: 'Долг не найден' }, { status: 404 });
		}

		const body = await req.json();
		const { name, targetAmount, deadline, description, type } = body;

		const trimmedName = typeof name === 'string' ? name.trim() : '';
		const amount = roundMoney(Number(targetAmount));
		const deadlineDate = new Date(deadline);
		const trimmedDescription =
			typeof description === 'string' ? description.trim() : '';

		if (type !== 'OWED_BY_ME' && type !== 'OWED_TO_ME') {
			return NextResponse.json(
				{ message: 'Укажите тип долга' },
				{ status: 400 },
			);
		}

		if (type !== debt.type) {
			return NextResponse.json(
				{ message: 'Тип долга нельзя изменить' },
				{ status: 400 },
			);
		}

		if (!trimmedName) {
			return NextResponse.json(
				{ message: 'Укажите, кто занял' },
				{ status: 400 },
			);
		}

		if (!Number.isFinite(amount) || amount <= 0) {
			return NextResponse.json(
				{ message: 'Сумма должна быть больше 0' },
				{ status: 400 },
			);
		}

		if (amount + 0.001 < roundMoney(debt.saved_amount)) {
			return NextResponse.json(
				{ message: 'Сумма меньше уже возвращённой части' },
				{ status: 400 },
			);
		}

		if (Number.isNaN(deadlineDate.getTime())) {
			return NextResponse.json(
				{ message: 'Укажите дату возврата' },
				{ status: 400 },
			);
		}

		const updated = await prisma.debt.update({
			where: { id },
			data: {
				name: trimmedName,
				target_amount: amount,
				deadline: deadlineDate,
				description: trimmedDescription || null,
				paid: roundMoney(debt.saved_amount) + 0.001 >= amount,
			},
		});

		return NextResponse.json({
			id: updated.id,
			name: updated.name,
			savedAmount: updated.saved_amount,
			targetAmount: updated.target_amount,
			deadline: updated.deadline.toISOString(),
			paid: updated.paid,
			type: updated.type,
			description: updated.description,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}

export async function DELETE(_req: Request, context: RouteContext) {
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

		const debt = await prisma.debt.findFirst({
			where: { id, userId },
			select: {
				id: true,
				type: true,
				transactions: {
					where: { type: 'DEBT' },
					select: {
						amount: true,
						debtAction: true,
						accountId: true,
					},
				},
			},
		});

		if (!debt) {
			return NextResponse.json({ message: 'Долг не найден' }, { status: 404 });
		}

		await prisma.$transaction(async tx => {
			for (const operation of debt.transactions) {
				if (
					!operation.accountId ||
					operation.amount == null ||
					(operation.debtAction !== 'ISSUE' && operation.debtAction !== 'REPAY')
				) {
					continue;
				}

				await tx.account.update({
					where: { id: operation.accountId },
					data: {
						balance: {
							increment: -cashDelta(
								debt.type,
								operation.debtAction,
								operation.amount,
							),
						},
					},
				});
			}

			await tx.debt.delete({
				where: { id: debt.id },
			});
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
