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
				debts: {
					orderBy: [{ deadline: 'asc' }, { createdAt: 'asc' }],
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
			debts: user.debts.map(debt => ({
				id: debt.id,
				name: debt.name,
				savedAmount: debt.saved_amount,
				targetAmount: debt.target_amount,
				deadline: debt.deadline.toISOString(),
				paid: debt.paid,
				type: debt.type,
				description: debt.description,
				createdAt: debt.createdAt.toISOString(),
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
		const { name, targetAmount, deadline, description, type } = body;

		const trimmedName = typeof name === 'string' ? name.trim() : '';
		const amount = Number(targetAmount);
		const deadlineDate = new Date(deadline);
		const trimmedDescription =
			typeof description === 'string' ? description.trim() : '';

		if (type !== 'OWED_BY_ME' && type !== 'OWED_TO_ME') {
			return NextResponse.json(
				{ message: 'Укажите тип долга' },
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

		if (Number.isNaN(deadlineDate.getTime())) {
			return NextResponse.json(
				{ message: 'Укажите дату возврата' },
				{ status: 400 },
			);
		}

		const debt = await prisma.debt.create({
			data: {
				name: trimmedName,
				target_amount: amount,
				saved_amount: 0,
				deadline: deadlineDate,
				paid: false,
				type,
				description: trimmedDescription || null,
				userId,
			},
		});

		return NextResponse.json(
			{
				id: debt.id,
				name: debt.name,
				savedAmount: debt.saved_amount,
				targetAmount: debt.target_amount,
				deadline: debt.deadline.toISOString(),
				paid: debt.paid,
				type: debt.type,
				description: debt.description,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
