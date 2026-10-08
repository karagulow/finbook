import { isPin } from '@/src/shared/lib/pin-constants';
import { getDeviceSession } from '@/src/shared/lib/pin-session';
import { createRegistrationOptions } from '@/src/shared/lib/biometric';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const result = await getDeviceSession(req);

	if ('error' in result && result.error) {
		return result.error;
	}

	const body = await req.json().catch(() => null);

	if (!isPin(body?.pin)) {
		return NextResponse.json(
			{ message: 'Пин-код должен состоять из 4 цифр.' },
			{ status: 400 },
		);
	}

	return createRegistrationOptions(req, result.session, result.email, body.pin);
}
