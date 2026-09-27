import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/prisma/prisma-client';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
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

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				currency: {
					select: {
						code: true,
						symbol: true,
					},
				},
				goals: {
					orderBy: [{ deadline: 'asc' }, { createdAt: 'asc' }],
					include: {
						transactions: {
							where: { type: 'GOAL' },
							orderBy: { date: 'desc' },
							select: {
								id: true,
								amount: true,
								goalType: true,
								date: true,
							},
						},
					},
				},
			},
		});

		if (!user) {
			return NextResponse.json(
				{ message: 'Пользователь не найден' },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			currencyCode: user.currency.code,
			currencySymbol: user.currency.symbol,
			goals: user.goals.map(goal => ({
				id: goal.id,
				name: goal.name,
				icon: goal.icon,
				savedAmount: goal.saved_amount,
				targetAmount: goal.target_amount,
				deadline: goal.deadline.toISOString(),
				description: goal.description,
				operations: goal.transactions.flatMap(transaction => {
					if (
						transaction.amount == null ||
						(transaction.goalType !== 'DEPOSIT' &&
							transaction.goalType !== 'WITHDRAW')
					) {
						return [];
					}

					return [
						{
							id: transaction.id,
							amount: transaction.amount,
							type: transaction.goalType,
							date: transaction.date.toISOString(),
						},
					];
				}),
			})),
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
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
		const { name, icon, targetAmount, deadline, description } = body;

		const trimmedName = typeof name === 'string' ? name.trim() : '';
		const trimmedIcon = typeof icon === 'string' ? icon.trim() : '';
		const amount = Number(targetAmount);
		const deadlineDate = new Date(deadline);
		const trimmedDescription =
			typeof description === 'string' ? description.trim() : '';

		if (!trimmedName || !trimmedIcon) {
			return NextResponse.json(
				{ message: 'Укажите название и эмодзи' },
				{ status: 400 },
			);
		}

		if (!Number.isFinite(amount) || amount <= 0) {
			return NextResponse.json(
				{ message: 'Сумма должна быть больше 0' },
				{ status: 400 },
			);
		}

		if (Number.isNaN(deadlineDate.getTime())) {
			return NextResponse.json(
				{ message: 'Укажите дату окончания' },
				{ status: 400 },
			);
		}

		const goal = await prisma.goal.create({
			data: {
				name: trimmedName,
				icon: trimmedIcon,
				target_amount: amount,
				saved_amount: 0,
				deadline: deadlineDate,
				description: trimmedDescription || null,
				userId,
			},
		});

		return NextResponse.json(
			{
				id: goal.id,
				name: goal.name,
				icon: goal.icon,
				savedAmount: goal.saved_amount,
				targetAmount: goal.target_amount,
				deadline: goal.deadline.toISOString(),
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
