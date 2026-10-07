import { isPin } from '@/src/shared/lib/pin-constants';
import {
	checkDevicePin,
	getDeviceSession,
	invalidPinResponse,
	pinExhaustedResponse,
} from '@/src/shared/lib/pin-session';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
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

	return NextResponse.json({ message: 'Пин-код верный' });
}
