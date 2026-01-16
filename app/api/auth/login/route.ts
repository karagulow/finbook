import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { UAParser } from 'ua-parser-js';
import crypto from 'crypto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export async function POST(req: Request) {
	if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
		return NextResponse.json(
			{ message: 'Произошла внутренняя ошибка сервера. Попробуйте позже.' },
			{ status: 500 }
		);
	}

	try {
		const { email, password } = await req.json();

		const userAgent = req.headers.get('user-agent') ?? '';
		const parser = new UAParser(userAgent);
		const uaResult = parser.getResult();
		const deviceInfo = `${uaResult.browser.name} on ${uaResult.os.name} ${
			uaResult.os.version ?? ''
		}`.trim();

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return NextResponse.json(
				{ message: 'Неправильный адрес электронной почты или пароль.' },
				{ status: 401 }
			);
		}

		const accessToken = jwt.sign(
			{ userId: user.id, email: user.email },
			JWT_SECRET,
			{ expiresIn: '15m' }
		);

		const jti = crypto.randomUUID();

		const refreshToken = jwt.sign(
			{ userId: user.id, email: user.email, jti },
			JWT_REFRESH_SECRET,
			{ expiresIn: '30d' }
		);

		await prisma.refreshToken.create({
			data: {
				id: jti,
				token: refreshToken,
				userId: user.id,
				expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				deviceInfo,
			},
		});

		const response = NextResponse.json(
			{ message: 'Вы успешно вошли в систему!' },
			{ status: 200 }
		);

		response.cookies.set('authToken', accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 900,
		});

		response.cookies.set('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 30 * 24 * 60 * 60,
		});

		return response;
	} catch (error) {
		console.error('Ошибка входа:', error);
		return NextResponse.json(
			{ message: 'Не удалось выполнить вход. Попробуйте ещё раз.' },
			{ status: 500 }
		);
	}
}
