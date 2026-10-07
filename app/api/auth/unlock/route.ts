import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { isPin } from '@/src/shared/lib/pin-constants';
import {
	checkDevicePin,
	createPinUnlockSecret,
	getDeviceSession,
	invalidPinResponse,
	pinExhaustedResponse,
	setAccessCookie,
	setPinEnabledCookie,
	setPinUnlockCookie,
	signAccessToken,
} from '@/src/shared/lib/pin-session';

export async function POST(req: Request) {
	const result = await getDeviceSession(req);

	if ('error' in result && result.error) {
		return result.error;
	}

	const { session, email } = result;

	if (!session.pinHash) {
		return NextResponse.json(
			{ message: 'Пин-код на этом устройстве не установлен.', code: 'PIN_DISABLED' },
			{ status: 400 },
		);
	}

	const body = await req.json().catch(() => null);

	if (!isPin(body?.pin)) {
		return NextResponse.json(
			{ message: 'Пин-код должен состоять из 4 цифр.' },
			{ status: 400 },
		);
	}

	const check = await checkDevicePin(
		session.id,
		session.pinHash,
		session.pinAttempts,
		body.pin,
	);

	if (!check.ok) {
		return check.exhausted
			? pinExhaustedResponse()
			: invalidPinResponse(check.attemptsLeft);
	}

	const pinUnlockSecret = createPinUnlockSecret();

	await prisma.refreshToken.update({
		where: { id: session.id },
		data: { pinUnlockSecret, pinAttempts: 0 },
	});

	const response = NextResponse.json({ message: 'Приложение разблокировано' });

	setAccessCookie(response, signAccessToken(session.userId, email, true));
	setPinEnabledCookie(response, true);
	setPinUnlockCookie(response, pinUnlockSecret);

	return response;
}
