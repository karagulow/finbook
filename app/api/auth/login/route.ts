import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
	if (!JWT_SECRET) {
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

		const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
			expiresIn: '1h',
		});
		return NextResponse.json(
			{ message: 'Успешный вход' },
			{
				status: 200,
				headers: {
					'Set-Cookie': `authToken=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
				},
			}
		);
	} catch (error) {
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
