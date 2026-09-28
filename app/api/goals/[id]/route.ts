import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/prisma/prisma-client';

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

		const goal = await prisma.goal.findFirst({
			where: { id, userId },
			select: { id: true },
		});

		if (!goal) {
			return NextResponse.json({ message: 'Цель не найдена' }, { status: 404 });
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

		const updated = await prisma.goal.update({
			where: { id },
			data: {
				name: trimmedName,
				icon: trimmedIcon,
				target_amount: amount,
				deadline: deadlineDate,
				description: trimmedDescription || null,
			},
		});

		return NextResponse.json({
			id: updated.id,
			name: updated.name,
			icon: updated.icon,
			savedAmount: updated.saved_amount,
			targetAmount: updated.target_amount,
			deadline: updated.deadline.toISOString(),
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

		const goal = await prisma.goal.findFirst({
			where: { id, userId },
			select: { id: true },
		});

		if (!goal) {
			return NextResponse.json({ message: 'Цель не найдена' }, { status: 404 });
		}

		await prisma.goal.delete({
			where: { id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
