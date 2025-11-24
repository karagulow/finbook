import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export async function POST(req: Request) {
	if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
		return NextResponse.json(
			{ message: 'Серверная ошибка: JWT_SECRET не настроен' },
			{ status: 500 }
		);
	}

	try {
		const cookies = req.headers.get('cookie') ?? '';
		const refreshToken = cookies
			.split('; ')
			.find(row => row.startsWith('refreshToken='))
			?.split('=')[1];

		if (!refreshToken) {
			return NextResponse.json(
				{ message: 'Нет refresh токена' },
				{ status: 401 }
			);
		}

		const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
			userId: string;
			email: string;
		};

		const existing = await prisma.refreshToken.findFirst({
			where: { token: refreshToken, userId: payload.userId },
		});
		if (!existing || existing.revoked || existing.expiresAt < new Date()) {
			return NextResponse.json(
				{ message: 'Недействительный refresh токен' },
				{
					status: 401,
					headers: {
						'Set-Cookie': [
							`authToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
							`refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
						].join(', '),
					},
				}
			);
		}

		const newAccessToken = jwt.sign(
			{ userId: payload.userId, email: payload.email },
			JWT_SECRET,
			{ expiresIn: '15m' }
		);

		return NextResponse.json(
			{ message: 'Новый токен выдан' },
			{
				status: 200,
				headers: {
					'Set-Cookie': `authToken=${newAccessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`,
				},
			}
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: 'Ошибка при обновлении токена' },
			{ status: 500 }
		);
	}
}
