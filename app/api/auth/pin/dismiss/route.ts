import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { getDeviceSession } from '@/src/shared/lib/pin-session';

export async function POST(req: Request) {
	const result = await getDeviceSession(req);

	if ('error' in result && result.error) {
		return result.error;
	}

	await prisma.refreshToken.update({
		where: { id: result.session.id },
		data: { pinPromptDismissed: true },
	});

	return NextResponse.json({ message: 'Хорошо, пин-код можно включить в настройках.' });
}
