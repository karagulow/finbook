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
		if (await prisma.user.findUnique({ where: { email } })) {
			return NextResponse.json(
				{ message: 'Email уже используется' },
				{ status: 400 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: { email, password: hashedPassword },
		});

		const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
			expiresIn: '1h',
		});
		return NextResponse.json(
			{ message: 'Регистрация успешна' },
			{
				status: 201,
				headers: {
					'Set-Cookie': `authToken=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
				},
			}
		);
	} catch (error) {
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
