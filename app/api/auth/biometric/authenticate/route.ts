import { NextResponse } from 'next/server';
import {
	isAuthenticationResponse,
	verifyAuthentication,
} from '@/src/shared/lib/biometric';
import { getDeviceSession } from '@/src/shared/lib/pin-session';

export async function POST(req: Request) {
	const result = await getDeviceSession(req);

	if ('error' in result && result.error) {
		return result.error;
	}

	const body = await req.json().catch(() => null);

	if (!isAuthenticationResponse(body)) {
		return NextResponse.json(
			{ message: 'Не удалось подтвердить биометрию. Введите пин-код.' },
			{ status: 400 },
		);
	}

	return verifyAuthentication(req, result.session, result.email, body);
}
