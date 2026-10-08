import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { clearedBiometricChallenge, deleteSessionBiometric } from '@/src/shared/lib/biometric';
import { isPin } from '@/src/shared/lib/pin-constants';
import {
	checkDevicePin,
	getDeviceSession,
	invalidPinResponse,
	pinExhaustedResponse,
} from '@/src/shared/lib/pin-session';

export async function DELETE(req: Request) {
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

	await prisma.$transaction([
		deleteSessionBiometric(session.id),
		prisma.refreshToken.update({
			where: { id: session.id },
			data: clearedBiometricChallenge,
		}),
	]);

	return NextResponse.json({ message: 'Биометрия отключена' });
}
