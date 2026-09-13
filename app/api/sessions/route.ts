import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/prisma/prisma-client';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export async function GET() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;
		const refreshToken = cookieStore.get('refreshToken')?.value;

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
				{ status: 401 }
			);
		}

		let currentId: string | null = null;

		if (refreshToken) {
			const payload = verify(refreshToken, JWT_REFRESH_SECRET) as {
				jti: string;
				userId: string;
			};
			currentId = payload.jti;
		}

		const sessions = await prisma.refreshToken.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(
			sessions
				.map(s => ({
					id: s.id,
					deviceInfo: s.deviceInfo,
					location: s.location,
					createdAt: s.createdAt,
					expiresAt: s.expiresAt,
					revoked: s.revoked,
					isCurrent: s.id === currentId,
				}))
				.filter(s => !s.revoked)
				.sort(s => (s.isCurrent ? -1 : 1))
		);
	} catch (error) {
		console.error('Ошибка при получении сессий:', error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}

export async function POST() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;
		const refreshToken = cookieStore.get('refreshToken')?.value;

		if (!token) {
			return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
		}

		let userId: string;
		try {
			userId = (verify(token, JWT_SECRET) as { userId: string }).userId;
		} catch {
			return NextResponse.json(
				{ message: 'Токен недействителен или истёк' },
				{ status: 401 }
			);
		}

		let currentId: string | null = null;
		if (refreshToken) {
			const payload = verify(refreshToken, JWT_REFRESH_SECRET) as {
				jti: string;
				userId: string;
			};
			currentId = payload.jti;
		}

		await prisma.refreshToken.updateMany({
			where: {
				userId,
				revoked: false,
				NOT: { id: currentId ?? '' },
			},
			data: { revoked: true },
		});

		return NextResponse.json({
			message: 'Все остальные сессии завершены',
		});
	} catch {
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
