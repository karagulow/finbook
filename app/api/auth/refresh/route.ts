import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { RefreshToken } from '@prisma/client';
import { prisma } from '@/prisma/prisma-client';
import { getDeviceInfo } from '@/src/shared/lib/device-info';
import { getRequestLocation } from '@/src/shared/lib/request-location';
import {
	PIN_ENABLED_COOKIE,
	PIN_UNLOCK_COOKIE,
	applySessionHint,
	authCookieOptions,
	readRequestCookie,
} from '@/src/shared/lib/pin-constants';
import {
	REFRESH_GRACE_MS,
	clearSessionCookies,
	resolveLiveRefreshSession,
	revokeRefreshChain,
} from '@/src/shared/lib/pin-session';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const SESSION_MAX_AGE = 30 * 24 * 60 * 60;
const ACCESS_MAX_AGE = 900;

type RefreshTokenPayload = {
	userId: string;
	email: string;
	jti?: string;
	iat?: number;
	exp?: number;
};

function isRefreshTokenPayload(
	payload: unknown,
): payload is RefreshTokenPayload {
	if (typeof payload !== 'object' || payload === null) {
		return false;
	}

	const data = payload as Record<string, unknown>;

	return typeof data.userId === 'string' && typeof data.email === 'string';
}

function invalidRefreshResponse() {
	return applySessionHint(
		clearSessionCookies(
			NextResponse.json(
				{ message: 'Refresh токен недействителен или истёк' },
				{ status: 401 },
			),
		),
		false,
	);
}

function refreshedResponse(email: string, session: RefreshToken) {
	const accessToken = jwt.sign(
		{
			userId: session.userId,
			email,
			pin: Boolean(session.pinHash),
		},
		JWT_SECRET,
		{ expiresIn: '15m' },
	);

	const response = NextResponse.json({ message: 'Токены обновлены' });
	const refreshMaxAge = Math.max(
		1,
		Math.floor((session.expiresAt.getTime() - Date.now()) / 1000),
	);

	response.cookies.set('authToken', accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/',
		maxAge: ACCESS_MAX_AGE,
	});

	response.cookies.set('refreshToken', session.token, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/',
		maxAge: refreshMaxAge,
	});

	if (session.pinHash) {
		response.cookies.set(PIN_ENABLED_COOKIE, '1', {
			...authCookieOptions,
			maxAge: SESSION_MAX_AGE,
		});
	} else {
		response.cookies.set(PIN_ENABLED_COOKIE, '', {
			...authCookieOptions,
			maxAge: 0,
		});
	}

	return applySessionHint(response, true);
}

export async function POST(req: Request) {
	if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
		return NextResponse.json(
			{ message: 'Произошла внутренняя ошибка сервера. Попробуйте позже.' },
			{ status: 500 },
		);
	}

	const oldRefreshToken = readRequestCookie(
		req.headers.get('cookie'),
		'refreshToken',
	);

	if (!oldRefreshToken) {
		return NextResponse.json(
			{ message: 'Нет refresh токена' },
			{ status: 401 },
		);
	}

	let payload: RefreshTokenPayload;

	try {
		const decoded = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET);

		if (!isRefreshTokenPayload(decoded)) {
			return invalidRefreshResponse();
		}

		payload = decoded;
	} catch (error) {
		console.error('Невалидный refresh токен:', error);
		return invalidRefreshResponse();
	}

	const existing = await prisma.refreshToken.findFirst({
		where: { token: oldRefreshToken, userId: payload.userId },
	});

	if (!existing) {
		return invalidRefreshResponse();
	}

	const resolved = await resolveLiveRefreshSession(existing);

	if (resolved.status === 'reused') {
		await revokeRefreshChain(existing.id);
		return invalidRefreshResponse();
	}

	if (resolved.status === 'invalid') {
		return invalidRefreshResponse();
	}

	const pinUnlock = readRequestCookie(
		req.headers.get('cookie'),
		PIN_UNLOCK_COOKIE,
	);

	if (
		resolved.session.pinHash &&
		(!pinUnlock || pinUnlock !== resolved.session.pinUnlockSecret)
	) {
		return NextResponse.json(
			{ message: 'Введите пин-код', code: 'PIN_REQUIRED' },
			{ status: 403 },
		);
	}

	if (resolved.session.id !== existing.id) {
		return refreshedResponse(payload.email, resolved.session);
	}

	const jti = crypto.randomUUID();
	const refreshToken = jwt.sign(
		{ userId: payload.userId, email: payload.email, jti },
		JWT_REFRESH_SECRET,
		{ expiresIn: '30d' },
	);
	const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);
	const graceUntil = new Date(Date.now() + REFRESH_GRACE_MS);

	const [deviceInfo, location] = await Promise.all([
		getDeviceInfo(req.headers),
		getRequestLocation(req.headers),
	]);

	try {
		const rotation = await prisma.$transaction(async tx => {
			const claim = await tx.refreshToken.updateMany({
				where: {
					id: existing.id,
					replacedById: null,
					revoked: false,
				},
				data: { replacedById: jti, graceUntil },
			});

			if (claim.count === 0) {
				const current = await tx.refreshToken.findUnique({
					where: { id: existing.id },
				});
				const graceOpen = Boolean(
					current?.graceUntil && current.graceUntil.getTime() >= Date.now(),
				);

				if (!current?.replacedById || !graceOpen) {
					return current?.replacedById
						? { type: 'reused' as const }
						: { type: 'invalid' as const };
				}

				const successor = await tx.refreshToken.findUnique({
					where: { id: current.replacedById },
				});

				if (
					!successor ||
					successor.revoked ||
					successor.expiresAt < new Date()
				) {
					return { type: 'invalid' as const };
				}

				return { type: 'replay' as const, session: successor };
			}

			const source = await tx.refreshToken.findUnique({
				where: { id: existing.id },
			});

			if (!source) {
				throw new Error('Сессия исчезла во время обновления');
			}

			const created = await tx.refreshToken.create({
				data: {
					id: jti,
					token: refreshToken,
					userId: payload.userId,
					expiresAt,
					deviceInfo,
					location: location ?? source.location,
					pinHash: source.pinHash,
					pinAttempts: source.pinAttempts,
					pinPromptDismissed: source.pinPromptDismissed,
					pinUnlockSecret: source.pinUnlockSecret,
					biometricChallenge: source.biometricChallenge,
					biometricChallengeExp: source.biometricChallengeExp,
					biometricChallengeKind: source.biometricChallengeKind,
				},
			});

			await tx.biometricCredential.updateMany({
				where: { sessionId: source.id },
				data: { sessionId: jti },
			});

			return { type: 'rotated' as const, session: created };
		});

		if (rotation.type === 'reused') {
			await revokeRefreshChain(existing.id);
			return invalidRefreshResponse();
		}

		if (rotation.type === 'invalid') {
			return invalidRefreshResponse();
		}

		return refreshedResponse(payload.email, rotation.session);
	} catch (error) {
		console.error('Ошибка при обновлении токенов:', error);

		return NextResponse.json(
			{ message: 'Ошибка при обновлении токенов' },
			{ status: 500 },
		);
	}
}
