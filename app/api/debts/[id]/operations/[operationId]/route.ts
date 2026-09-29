import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/prisma/prisma-client';
import { cashDelta, roundMoney } from '../../../lib/cash-delta';

const JWT_SECRET = process.env.JWT_SECRET!;

type RouteContext = {
	params: Promise<{ id: string; operationId: string }>;
};

export async function DELETE(_req: NextRequest, context: RouteContext) {
	const { id, operationId } = await context.params;

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

		const operation = await prisma.transaction.findFirst({
			where: {
				id: operationId,
				debtId: id,
				userId,
				type: 'DEBT',
				OR: [{ debtAction: 'REPAY' }, { debtAction: null }],
			},
			select: {
				id: true,
				amount: true,
				accountId: true,
				debtAction: true,
				debt: {
					select: {
						id: true,
						type: true,
						saved_amount: true,
						target_amount: true,
					},
				},
			},
		});

		if (
			!operation?.debt ||
			operation.amount == null ||
			(operation.debt.type !== 'OWED_BY_ME' &&
				operation.debt.type !== 'OWED_TO_ME')
		) {
			return NextResponse.json(
				{ message: 'Операция не найдена' },
				{ status: 404 },
			);
		}

		const debt = operation.debt;
		const operationAmount = roundMoney(operation.amount);
		const savedAmount = roundMoney(debt.saved_amount);
		const nextSavedAmount = roundMoney(savedAmount - operationAmount);

		if (nextSavedAmount < -0.001) {
			return NextResponse.json(
				{ message: 'Нельзя удалить эту операцию' },
				{ status: 400 },
			);
		}

		const saved = Math.max(0, nextSavedAmount);
		const targetAmount = roundMoney(debt.target_amount);
		const paid = saved + 0.001 >= targetAmount;
		const accountId = operation.accountId;

		if (accountId) {
			const account = await prisma.account.findFirst({
				where: { id: accountId, userId },
				select: { id: true },
			});

			if (!account) {
				return NextResponse.json(
					{ message: 'Счёт не найден' },
					{ status: 404 },
				);
			}
		}

		await prisma.$transaction(async tx => {
			await tx.transaction.delete({
				where: { id: operation.id },
			});

			await tx.debt.update({
				where: { id: debt.id },
				data: { saved_amount: saved, paid },
			});

			if (accountId && operation.debtAction === 'REPAY') {
				await tx.account.update({
					where: { id: accountId },
					data: {
						balance: {
							increment: -cashDelta(debt.type, 'REPAY', operationAmount),
						},
					},
				});
			}
		});

		return NextResponse.json({
			success: true,
			savedAmount: saved,
			paid,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
