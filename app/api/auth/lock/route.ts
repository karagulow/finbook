import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { clearPinUnlockCookie, getDeviceSession } from '@/src/shared/lib/pin-session';

export async function POST(req: Request) {
	const result = await getDeviceSession(req);

	if ('error' in result && result.error) {
		return result.error;
	}

	await prisma.refreshToken.update({
		where: { id: result.session.id },
		data: { pinUnlockSecret: null },
	});

	const response = NextResponse.json({ message: 'Приложение заблокировано' });
	clearPinUnlockCookie(response);

	return response;
}
