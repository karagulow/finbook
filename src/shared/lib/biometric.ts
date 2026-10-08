import { NextResponse } from 'next/server';
import {
	generateAuthenticationOptions,
	generateRegistrationOptions,
	verifyAuthenticationResponse,
	verifyRegistrationResponse,
	type AuthenticationResponseJSON,
	type RegistrationResponseJSON,
} from '@simplewebauthn/server';
import { prisma } from '@/prisma/prisma-client';
import {
	checkDevicePin,
	createPinUnlockSecret,
	invalidPinResponse,
	pinExhaustedResponse,
	setAccessCookie,
	setPinEnabledCookie,
	setPinUnlockCookie,
	signAccessToken,
} from './pin-session';

const CHALLENGE_MS = 2 * 60 * 1000;
const RP_NAME = 'Финкнижка';

type SessionWithPin = {
	id: string;
	userId: string;
	pinHash: string | null;
	pinAttempts: number;
	biometricChallenge: string | null;
	biometricChallengeExp: Date | null;
	biometricChallengeKind: string | null;
};

export const clearedBiometricChallenge = {
	biometricChallenge: null,
	biometricChallengeExp: null,
	biometricChallengeKind: null,
};

export function webAuthnContext(req: Request) {
	const originHeader = req.headers.get('origin');
	const hostHeader = (req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '')
		.split(',')[0]
		.trim();
	const rpID = hostHeader.split(':')[0];

	if (!originHeader || !rpID) {
		return null;
	}

	try {
		if (new URL(originHeader).hostname !== rpID) {
			return null;
		}
	} catch {
		return null;
	}

	return { origin: originHeader, rpID };
}

export function biometricContextError() {
	return NextResponse.json(
		{ message: 'Не удалось начать проверку биометрии.' },
		{ status: 400 },
	);
}

export function deleteSessionBiometric(sessionId: string) {
	return prisma.biometricCredential.deleteMany({ where: { sessionId } });
}

function readChallenge(session: SessionWithPin, kind: 'register' | 'unlock') {
	if (
		session.biometricChallengeKind !== kind ||
		!session.biometricChallenge ||
		!session.biometricChallengeExp ||
		session.biometricChallengeExp < new Date()
	) {
		return null;
	}

	return session.biometricChallenge;
}

async function clearChallenge(sessionId: string) {
	await prisma.refreshToken.update({
		where: { id: sessionId },
		data: clearedBiometricChallenge,
	});
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

export function isRegistrationResponse(
	value: unknown,
): value is RegistrationResponseJSON {
	if (!isRecord(value) || !isRecord(value.response)) {
		return false;
	}

	return (
		typeof value.id === 'string' &&
		typeof value.rawId === 'string' &&
		value.type === 'public-key' &&
		typeof value.response.clientDataJSON === 'string' &&
		typeof value.response.attestationObject === 'string'
	);
}

export function isAuthenticationResponse(
	value: unknown,
): value is AuthenticationResponseJSON {
	if (!isRecord(value) || !isRecord(value.response)) {
		return false;
	}

	return (
		typeof value.id === 'string' &&
		typeof value.rawId === 'string' &&
		value.type === 'public-key' &&
		typeof value.response.clientDataJSON === 'string' &&
		typeof value.response.authenticatorData === 'string' &&
		typeof value.response.signature === 'string'
	);
}

export async function createRegistrationOptions(
	req: Request,
	session: SessionWithPin,
	email: string,
	pin: string,
) {
	if (!session.pinHash) {
		return NextResponse.json(
			{ message: 'Сначала установите пин-код.' },
			{ status: 400 },
		);
	}

	const existing = await prisma.biometricCredential.findUnique({
		where: { sessionId: session.id },
		select: { id: true },
	});

	if (existing) {
		return NextResponse.json(
			{ message: 'Биометрия на этом устройстве уже включена.' },
			{ status: 409 },
		);
	}

	const context = webAuthnContext(req);

	if (!context) {
		return biometricContextError();
	}

	const check = await checkDevicePin(
		session.id,
		session.pinHash,
		session.pinAttempts,
		pin,
	);

	if (!check.ok) {
		return check.exhausted
			? pinExhaustedResponse()
			: invalidPinResponse(check.attemptsLeft);
	}

	const options = await generateRegistrationOptions({
		rpName: RP_NAME,
		rpID: context.rpID,
		userName: email,
		userID: new TextEncoder().encode(session.userId),
		userDisplayName: email,
		attestationType: 'none',
		authenticatorSelection: {
			authenticatorAttachment: 'platform',
			residentKey: 'preferred',
			userVerification: 'required',
		},
		preferredAuthenticatorType: 'localDevice',
		timeout: 60_000,
	});

	await prisma.refreshToken.update({
		where: { id: session.id },
		data: {
			biometricChallenge: options.challenge,
			biometricChallengeExp: new Date(Date.now() + CHALLENGE_MS),
			biometricChallengeKind: 'register',
		},
	});

	return NextResponse.json(options);
}

export async function verifyRegistration(
	req: Request,
	session: SessionWithPin,
	response: RegistrationResponseJSON,
) {
	if (!session.pinHash) {
		return NextResponse.json(
			{ message: 'Сначала установите пин-код.' },
			{ status: 400 },
		);
	}

	const context = webAuthnContext(req);
	const challenge = readChallenge(session, 'register');

	if (!context || !challenge) {
		await clearChallenge(session.id);
		return NextResponse.json(
			{ message: 'Подтверждение устарело. Попробуйте ещё раз.' },
			{ status: 400 },
		);
	}

	if (response.authenticatorAttachment === 'cross-platform') {
		await clearChallenge(session.id);
		return NextResponse.json(
			{ message: 'Нужна биометрия этого устройства, а не внешний ключ.' },
			{ status: 400 },
		);
	}

	try {
		const verification = await verifyRegistrationResponse({
			response,
			expectedChallenge: challenge,
			expectedOrigin: context.origin,
			expectedRPID: context.rpID,
			requireUserVerification: true,
		});

		if (!verification.verified || !verification.registrationInfo.userVerified) {
			await clearChallenge(session.id);
			return NextResponse.json(
				{ message: 'Не удалось включить биометрию.' },
				{ status: 400 },
			);
		}

		const { credential } = verification.registrationInfo;

		await prisma.$transaction([
			prisma.biometricCredential.deleteMany({ where: { sessionId: session.id } }),
			prisma.biometricCredential.create({
				data: {
					credentialId: credential.id,
					publicKey: Buffer.from(credential.publicKey),
					counter: credential.counter,
					transports: credential.transports?.join(',') || null,
					sessionId: session.id,
				},
			}),
			prisma.refreshToken.update({
				where: { id: session.id },
				data: clearedBiometricChallenge,
			}),
		]);

		return NextResponse.json({ message: 'Биометрия включена' });
	} catch (error) {
		console.error('Ошибка регистрации биометрии:', error);
		await clearChallenge(session.id);
		return NextResponse.json(
			{ message: 'Не удалось включить биометрию.' },
			{ status: 400 },
		);
	}
}

export async function createAuthenticationOptions(
	req: Request,
	session: SessionWithPin,
) {
	if (!session.pinHash) {
		return NextResponse.json(
			{ message: 'Пин-код на этом устройстве не установлен.', code: 'PIN_DISABLED' },
			{ status: 400 },
		);
	}

	const credential = await prisma.biometricCredential.findUnique({
		where: { sessionId: session.id },
	});

	if (!credential) {
		return NextResponse.json(
			{ message: 'Биометрия на этом устройстве не включена.', code: 'BIOMETRIC_DISABLED' },
			{ status: 400 },
		);
	}

	const context = webAuthnContext(req);

	if (!context) {
		return biometricContextError();
	}

	const options = await generateAuthenticationOptions({
		rpID: context.rpID,
		allowCredentials: [
			{
				id: credential.credentialId,
				transports: credential.transports?.split(',').filter(Boolean),
			},
		],
		userVerification: 'required',
		timeout: 60_000,
	});

	await prisma.refreshToken.update({
		where: { id: session.id },
		data: {
			biometricChallenge: options.challenge,
			biometricChallengeExp: new Date(Date.now() + CHALLENGE_MS),
			biometricChallengeKind: 'unlock',
		},
	});

	return NextResponse.json(options);
}

export async function verifyAuthentication(
	req: Request,
	session: SessionWithPin & { userId: string },
	email: string,
	response: AuthenticationResponseJSON,
) {
	if (!session.pinHash) {
		return NextResponse.json(
			{ message: 'Пин-код на этом устройстве не установлен.', code: 'PIN_DISABLED' },
			{ status: 400 },
		);
	}

	const credential = await prisma.biometricCredential.findUnique({
		where: { sessionId: session.id },
	});
	const context = webAuthnContext(req);
	const challenge = readChallenge(session, 'unlock');

	if (!credential || credential.credentialId !== response.id || !context || !challenge) {
		await clearChallenge(session.id);
		return NextResponse.json(
			{ message: 'Не удалось подтвердить биометрию. Введите пин-код.' },
			{ status: 400 },
		);
	}

	try {
		const verification = await verifyAuthenticationResponse({
			response,
			expectedChallenge: challenge,
			expectedOrigin: context.origin,
			expectedRPID: context.rpID,
			requireUserVerification: true,
			credential: {
				id: credential.credentialId,
				publicKey: new Uint8Array(credential.publicKey),
				counter: credential.counter,
				transports: credential.transports?.split(',').filter(Boolean),
			},
		});

		if (!verification.verified || !verification.authenticationInfo.userVerified) {
			await clearChallenge(session.id);
			return NextResponse.json(
				{ message: 'Не удалось подтвердить биометрию. Введите пин-код.' },
				{ status: 400 },
			);
		}

		const pinUnlockSecret = createPinUnlockSecret();

		await prisma.$transaction([
			prisma.biometricCredential.update({
				where: { id: credential.id },
				data: { counter: verification.authenticationInfo.newCounter },
			}),
			prisma.refreshToken.update({
				where: { id: session.id },
				data: {
					pinUnlockSecret,
					pinAttempts: 0,
					...clearedBiometricChallenge,
				},
			}),
		]);

		const result = NextResponse.json({ message: 'Приложение разблокировано' });

		setAccessCookie(result, signAccessToken(session.userId, email, true));
		setPinEnabledCookie(result, true);
		setPinUnlockCookie(result, pinUnlockSecret);

		return result;
	} catch (error) {
		console.error('Ошибка проверки биометрии:', error);
		await clearChallenge(session.id);
		return NextResponse.json(
			{ message: 'Не удалось подтвердить биометрию. Введите пин-код.' },
			{ status: 400 },
		);
	}
}
