import { NextResponse } from 'next/server';
import { hasSession } from '@/src/shared/lib/has-session';

export async function GET() {
	return NextResponse.json(
		{ authenticated: await hasSession() },
		{ headers: { 'Cache-Control': 'no-store' } },
	);
}
