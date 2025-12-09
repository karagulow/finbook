import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
	const now = new Date();

	const deleted = await prisma.refreshToken.deleteMany({
		where: {
			OR: [{ expiresAt: { lt: now } }, { revoked: true }],
		},
	});

	return NextResponse.json({ success: true, deleted: deleted.count });
}
