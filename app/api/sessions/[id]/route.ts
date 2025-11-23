import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/prisma/prisma-client';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const sessionId = params.id;

	const cookieStore = await cookies();
	const token = cookieStore.get('authToken')?.value;
	const refreshToken = cookieStore.get('refreshToken')?.value;

	if (!token) {
		return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
	}

	let userId: string;
	try {
		userId = (verify(token, JWT_SECRET) as any).userId;
	} catch {
		return NextResponse.json(
			{ message: 'Токен истёк или недействителен' },
			{ status: 401 }
		);
	}

	let currentId: string | null = null;
	if (refreshToken) {
		const payload = verify(refreshToken, JWT_REFRESH_SECRET) as any;
		currentId = payload.jti;
	}

	if (sessionId === currentId) {
		return NextResponse.json(
			{ message: 'Нельзя удалить текущую активную сессию' },
			{ status: 400 }
		);
	}

	const session = await prisma.refreshToken.findUnique({
		where: { id: sessionId },
	});

	if (!session || session.userId !== userId) {
		return NextResponse.json({ message: 'Сессия не найдена' }, { status: 404 });
	}

	await prisma.refreshToken.delete({
		where: { id: sessionId },
	});

	return NextResponse.json({ message: 'Сессия удалена' });
}
