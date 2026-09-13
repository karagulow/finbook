import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { getDeviceInfo } from '@/src/shared/lib/device-info';
import { getRequestLocation } from '@/src/shared/lib/request-location';
import crypto from 'crypto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

type RefreshTokenPayload = {
	userId: string;
	email: string;
	jti?: string;
	iat?: number;
	exp?: number;
};

function isRefreshTokenPayload(
	payload: unknown
): payload is RefreshTokenPayload {
	if (typeof payload !== 'object' || payload === null) {
		return false;
	}

	const data = payload as Record<string, unknown>;

	return typeof data.userId === 'string' && typeof data.email === 'string';
}

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

	let payload: RefreshTokenPayload;

	try {
		const decoded = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET);

		if (!isRefreshTokenPayload(decoded)) {
			const errorResponse = NextResponse.json(
				{ message: 'Некорректный payload refresh токена' },
				{ status: 401 }
			);

			errorResponse.cookies.set('authToken', '', {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				path: '/',
				maxAge: 0,
			});

			errorResponse.cookies.set('refreshToken', '', {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				path: '/',
				maxAge: 0,
			});

			return errorResponse;
		}

		payload = decoded;
	} catch (error) {
		const errorResponse = NextResponse.json(
			{ message: 'Refresh токен истёк или невалиден' + error },
			{ status: 401 }
		);

		errorResponse.cookies.set('authToken', '', {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 0,
		});

		errorResponse.cookies.set('refreshToken', '', {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 0,
		});

		return errorResponse;
	}

	const existing = await prisma.refreshToken.findFirst({
		where: { token: oldRefreshToken, userId: payload.userId },
	});

	if (!existing || existing.expiresAt < new Date() || existing.revoked) {
		const errorResponse = NextResponse.json(
			{ message: 'Refresh токен недействителен или истёк' },
			{ status: 401 }
		);

		errorResponse.cookies.set('authToken', '', {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 0,
		});

		errorResponse.cookies.set('refreshToken', '', {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 0,
		});

		return errorResponse;
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

	const [deviceInfo, location] = await Promise.all([
		getDeviceInfo(req.headers),
		getRequestLocation(req.headers),
	]);

	try {
		await prisma.$transaction(async tx => {
			await tx.refreshToken.deleteMany({
				where: { token: oldRefreshToken },
			});

			await tx.refreshToken.create({
				data: {
					id: jti,
					token: refreshToken,
					userId: payload.userId,
					expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
					deviceInfo,
					location: location ?? existing.location,
				},
			});
		});
	} catch (error) {
		console.error('Ошибка при обновлении токенов:', error);

		const errorResponse = NextResponse.json(
			{ message: 'Ошибка при обновлении токенов' },
			{ status: 500 }
		);

		errorResponse.cookies.set('authToken', '', {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 0,
		});

		errorResponse.cookies.set('refreshToken', '', {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 0,
		});

		return errorResponse;
	}

	const response = NextResponse.json({ message: 'Токены обновлены' });

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
}
