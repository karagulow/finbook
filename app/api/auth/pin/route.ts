import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { isPin } from '@/src/shared/lib/pin-constants';
import {
	checkDevicePin,
	createPinUnlockSecret,
	getDeviceSession,
	hashPin,
	invalidPinResponse,
	pinExhaustedResponse,
	setAccessCookie,
	setPinEnabledCookie,
	setPinUnlockCookie,
	signAccessToken,
} from '@/src/shared/lib/pin-session';

export async function GET(req: Request) {
	const result = await getDeviceSession(req);

	if ('error' in result && result.error) {
		return result.error;
	}

	const { session } = result;

	return NextResponse.json({
		enabled: Boolean(session.pinHash),
		prompt: !session.pinHash && !session.pinPromptDismissed,
	});
}

export async function POST(req: Request) {
	const result = await getDeviceSession(req);

	if ('error' in result && result.error) {
		return result.error;
	}

	const { session, email } = result;

	if (session.pinHash) {
		return NextResponse.json(
			{ message: 'Пин-код уже установлен. Его можно изменить в настройках.' },
			{ status: 409 },
		);
	}

	const body = await req.json().catch(() => null);
	const pin = body?.pin;

	if (!isPin(pin)) {
		return NextResponse.json(
			{ message: 'Пин-код должен состоять из 4 цифр.' },
			{ status: 400 },
		);
	}

	const pinHash = await hashPin(pin);
	const pinUnlockSecret = createPinUnlockSecret();

	await prisma.refreshToken.update({
		where: { id: session.id },
		data: {
			pinHash,
			pinAttempts: 0,
			pinPromptDismissed: true,
			pinUnlockSecret,
		},
	});

	const response = NextResponse.json({ message: 'Пин-код установлен' });
	const accessToken = signAccessToken(session.userId, email, true);

	setAccessCookie(response, accessToken);
	setPinEnabledCookie(response, true);
	setPinUnlockCookie(response, pinUnlockSecret);

	return response;
}

export async function PATCH(req: Request) {
	const result = await getDeviceSession(req);

	if ('error' in result && result.error) {
		return result.error;
	}

	const { session } = result;

	if (!session.pinHash) {
		return NextResponse.json(
			{ message: 'Пин-код ещё не установлен.' },
			{ status: 400 },
		);
	}

	const body = await req.json().catch(() => null);

	if (!isPin(body?.currentPin) || !isPin(body?.pin)) {
		return NextResponse.json(
			{ message: 'Пин-код должен состоять из 4 цифр.' },
			{ status: 400 },
		);
	}

	const check = await checkDevicePin(
		session.id,
		session.pinHash,
		session.pinAttempts,
		body.currentPin,
	);

	if (!check.ok) {
		return check.exhausted
			? pinExhaustedResponse()
			: invalidPinResponse(check.attemptsLeft);
	}

	await prisma.refreshToken.update({
		where: { id: session.id },
		data: { pinHash: await hashPin(body.pin), pinAttempts: 0 },
	});

	return NextResponse.json({ message: 'Пин-код изменён' });
}

export async function DELETE(req: Request) {
	const result = await getDeviceSession(req);

	if ('error' in result && result.error) {
		return result.error;
	}

	const { session, email } = result;

	if (!session.pinHash) {
		return NextResponse.json(
			{ message: 'Пин-код ещё не установлен.' },
			{ status: 400 },
		);
	}

	const body = await req.json().catch(() => null);

	if (!isPin(body?.currentPin)) {
		return NextResponse.json(
			{ message: 'Пин-код должен состоять из 4 цифр.' },
			{ status: 400 },
		);
	}

	const check = await checkDevicePin(
		session.id,
		session.pinHash,
		session.pinAttempts,
		body.currentPin,
	);

	if (!check.ok) {
		return check.exhausted
			? pinExhaustedResponse()
			: invalidPinResponse(check.attemptsLeft);
	}

	await prisma.refreshToken.update({
		where: { id: session.id },
		data: {
			pinHash: null,
			pinAttempts: 0,
			pinUnlockSecret: null,
			pinPromptDismissed: true,
		},
	});

	const response = NextResponse.json({ message: 'Пин-код отключён' });
	setAccessCookie(response, signAccessToken(session.userId, email, false));
	setPinEnabledCookie(response, false);

	return response;
}
