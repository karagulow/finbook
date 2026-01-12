import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { UAParser } from 'ua-parser-js';
import crypto from 'crypto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export async function POST(req: Request) {
	const cookies = req.headers.get('cookie') ?? '';
	const oldRefreshToken = cookies
		.split('; ')
		.find(row => row.startsWith('refreshToken='))
		?.split('=')[1];

	if (!oldRefreshToken) {
		return NextResponse.json(
			{ message: 'Нет refresh токена' },
			{ status: 401 }
		);
	}

	let payload: { userId: string; email: string };

	try {
		payload = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET) as any;
	} catch {
		return NextResponse.json(
			{ message: 'Невалидный refresh токен' },
			{ status: 401 }
		);
	}

	const existing = await prisma.refreshToken.findFirst({
		where: { token: oldRefreshToken, userId: payload.userId },
	});

	if (!existing || existing.expiresAt < new Date()) {
		return NextResponse.json(
			{ message: 'Refresh токен истёк' },
			{ status: 401 }
		);
	}

	const accessToken = jwt.sign(
		{ userId: payload.userId, email: payload.email },
		JWT_SECRET,
		{ expiresIn: '15m' }
	);

	const jti = crypto.randomUUID();

	const refreshToken = jwt.sign(
		{ userId: payload.userId, email: payload.email, jti },
		JWT_REFRESH_SECRET,
		{ expiresIn: '30d' }
	);

	const userAgent = req.headers.get('user-agent') ?? '';
	const parser = new UAParser(userAgent);
	const uaResult = parser.getResult();
	const deviceInfo = `${uaResult.browser.name} on ${uaResult.os.name} ${
		uaResult.os.version ?? ''
	}`.trim();

	await prisma.$transaction(async tx => {
		await tx.refreshToken.delete({
			where: { token: oldRefreshToken },
		});

		await tx.refreshToken.create({
			data: {
				id: jti,
				token: refreshToken,
				userId: payload.userId,
				expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				deviceInfo,
			},
		});
	});

	return NextResponse.json(
		{ message: 'Токены обновлены' },
		{
			headers: {
				'Set-Cookie': [
					`authToken=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`,
					`refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${
						30 * 24 * 60 * 60
					}`,
				].join(', '),
			},
		}
	);
}
