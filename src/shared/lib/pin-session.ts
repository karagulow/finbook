import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/prisma/prisma-client';
import {
	PIN_ENABLED_COOKIE,
	PIN_MAX_ATTEMPTS,
	PIN_UNLOCK_COOKIE,
	PIN_WINDOW_COOKIE,
	authCookieOptions,
	readRequestCookie,
} from './pin-constants';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const SESSION_MAX_AGE = 30 * 24 * 60 * 60;
const ACCESS_MAX_AGE = 900;

type RefreshPayload = {
	userId: string;
	email: string;
};

function isRefreshPayload(payload: unknown): payload is RefreshPayload {
	if (typeof payload !== 'object' || payload === null) {
		return false;
	}

	const data = payload as Record<string, unknown>;

	return typeof data.userId === 'string' && typeof data.email === 'string';
}

export function signAccessToken(userId: string, email: string, pin: boolean) {
	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET is not set');
	}

	return jwt.sign({ userId, email, pin }, JWT_SECRET, { expiresIn: '15m' });
}

export function clearSessionCookies(response: NextResponse) {
	for (const name of [
		'authToken',
		'refreshToken',
		PIN_ENABLED_COOKIE,
		PIN_UNLOCK_COOKIE,
		PIN_WINDOW_COOKIE,
	]) {
		response.cookies.set(name, '', { ...authCookieOptions, maxAge: 0 });
	}

	return response;
}

export function clearPinCookies(response: NextResponse) {
	response.cookies.set(PIN_ENABLED_COOKIE, '', {
		...authCookieOptions,
		maxAge: 0,
	});
	response.cookies.set(PIN_UNLOCK_COOKIE, '', {
		...authCookieOptions,
		maxAge: 0,
	});
	response.cookies.set(PIN_WINDOW_COOKIE, '', {
		...authCookieOptions,
		httpOnly: false,
		maxAge: 0,
	});

	return response;
}

export function setAccessCookie(response: NextResponse, accessToken: string) {
	response.cookies.set('authToken', accessToken, {
		...authCookieOptions,
		maxAge: ACCESS_MAX_AGE,
	});
}

export function setPinEnabledCookie(response: NextResponse, enabled: boolean) {
	if (!enabled) {
		response.cookies.set(PIN_ENABLED_COOKIE, '', {
			...authCookieOptions,
			maxAge: 0,
		});
		response.cookies.set(PIN_UNLOCK_COOKIE, '', {
			...authCookieOptions,
			maxAge: 0,
		});
		response.cookies.set(PIN_WINDOW_COOKIE, '', {
			...authCookieOptions,
			httpOnly: false,
			maxAge: 0,
		});
		return;
	}

	response.cookies.set(PIN_ENABLED_COOKIE, '1', {
		...authCookieOptions,
		maxAge: SESSION_MAX_AGE,
	});
}

export function setPinUnlockCookie(response: NextResponse, secret: string) {
	response.cookies.set(PIN_UNLOCK_COOKIE, secret, authCookieOptions);
	response.cookies.set(PIN_WINDOW_COOKIE, '1', {
		...authCookieOptions,
		httpOnly: false,
	});
}

export function clearPinUnlockCookie(response: NextResponse) {
	response.cookies.set(PIN_UNLOCK_COOKIE, '', {
		...authCookieOptions,
		maxAge: 0,
	});
	response.cookies.set(PIN_WINDOW_COOKIE, '', {
		...authCookieOptions,
		httpOnly: false,
		maxAge: 0,
	});
}

export function createPinUnlockSecret() {
	return crypto.randomBytes(32).toString('hex');
}

function pinMaterial(pin: string) {
	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET is not set');
	}

	return crypto.createHmac('sha256', JWT_SECRET).update(pin).digest('hex');
}

export function hashPin(pin: string) {
	return bcrypt.hash(pinMaterial(pin), 10);
}

export async function getDeviceSession(req: Request) {
	if (!JWT_REFRESH_SECRET) {
		return {
			error: NextResponse.json(
				{ message: 'Произошла внутренняя ошибка сервера. Попробуйте позже.' },
				{ status: 500 },
			),
		};
	}

	const refreshToken = readRequestCookie(
		req.headers.get('cookie'),
		'refreshToken',
	);

	if (!refreshToken) {
		return {
			error: NextResponse.json(
				{ message: 'Нет активной сессии' },
				{ status: 401 },
			),
		};
	}

	let payload: RefreshPayload;

	try {
		const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

		if (!isRefreshPayload(decoded)) {
			return { error: clearSessionCookies(invalidSessionResponse()) };
		}

		payload = decoded;
	} catch {
		return { error: clearSessionCookies(invalidSessionResponse()) };
	}

	const session = await prisma.refreshToken.findFirst({
		where: { token: refreshToken, userId: payload.userId },
	});

	if (!session || session.revoked || session.expiresAt < new Date()) {
		return { error: clearSessionCookies(invalidSessionResponse()) };
	}

	return { session, email: payload.email };
}

function invalidSessionResponse() {
	return NextResponse.json(
		{ message: 'Сессия недействительна. Войдите снова.' },
		{ status: 401 },
	);
}

export function pinExhaustedResponse() {
	return clearSessionCookies(
		NextResponse.json(
			{
				message: 'Слишком много попыток. Войдите с паролем.',
				code: 'PIN_EXHAUSTED',
			},
			{ status: 401 },
		),
	);
}

export async function checkDevicePin(
	sessionId: string,
	pinHash: string,
	attempts: number,
	pin: string,
) {
	const matches = await bcrypt.compare(pinMaterial(pin), pinHash);

	if (matches) {
		await prisma.refreshToken.update({
			where: { id: sessionId },
			data: { pinAttempts: 0 },
		});

		return { ok: true as const };
	}

	const nextAttempts = attempts + 1;

	if (nextAttempts >= PIN_MAX_ATTEMPTS) {
		await prisma.$transaction([
			prisma.biometricCredential.deleteMany({ where: { sessionId } }),
			prisma.refreshToken.update({
				where: { id: sessionId },
				data: { revoked: true, pinAttempts: nextAttempts },
			}),
		]);

		return { ok: false as const, exhausted: true as const };
	}

	await prisma.refreshToken.update({
		where: { id: sessionId },
		data: { pinAttempts: nextAttempts },
	});

	return {
		ok: false as const,
		exhausted: false as const,
		attemptsLeft: PIN_MAX_ATTEMPTS - nextAttempts,
	};
}

export function invalidPinResponse(attemptsLeft: number) {
	return NextResponse.json(
		{
			message: `Неверный пин-код. Осталось попыток: ${attemptsLeft}.`,
			code: 'PIN_INVALID',
			attemptsLeft,
		},
		{ status: 400 },
	);
}
