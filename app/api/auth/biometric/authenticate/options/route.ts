import { createAuthenticationOptions } from '@/src/shared/lib/biometric';
import { getDeviceSession } from '@/src/shared/lib/pin-session';

export async function POST(req: Request) {
	const result = await getDeviceSession(req);

	if ('error' in result && result.error) {
		return result.error;
	}

	return createAuthenticationOptions(req, result.session);
}
