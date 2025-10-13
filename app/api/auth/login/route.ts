import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
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
		const { email, password } = await req.json();

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return NextResponse.json(
				{ message: 'Неверные credentials' },
				{ status: 401 }
			);
		}

		const accessToken = jwt.sign(
			{ userId: user.id, email: user.email },
			JWT_SECRET,
			{ expiresIn: '15m' }
		);

		const refreshToken = jwt.sign(
			{ userId: user.id, email: user.email },
			JWT_REFRESH_SECRET,
			{ expiresIn: '7d' }
		);

		await prisma.user.update({
			where: { id: user.id },
			data: { refreshToken },
		});

		return NextResponse.json(
			{ message: 'Успешный вход' },
			{
				status: 200,
				headers: {
					'Set-Cookie': [
						`authToken=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`,
						`refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${
							7 * 24 * 60 * 60
						}`,
					].join(', '),
				},
			}
		);
	} catch (error) {
		console.error('Ошибка входа:', error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
