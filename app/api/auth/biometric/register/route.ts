import { NextResponse } from 'next/server';
import { isRegistrationResponse, verifyRegistration } from '@/src/shared/lib/biometric';
import { getDeviceSession } from '@/src/shared/lib/pin-session';

export async function POST(req: Request) {
	const result = await getDeviceSession(req);

	if ('error' in result && result.error) {
		return result.error;
	}

	const body = await req.json().catch(() => null);

	if (!isRegistrationResponse(body)) {
		return NextResponse.json(
			{ message: 'Не удалось включить биометрию.' },
			{ status: 400 },
		);
	}

	return verifyRegistration(req, result.session, body);
}
