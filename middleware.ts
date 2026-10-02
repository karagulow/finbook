import { NextRequest, NextResponse } from 'next/server';

const GUEST_PATHS = ['/login', '/registration'] as const;
const PROTECTED_PATHS = [
	'/home',
	'/transactions',
	'/analytics',
	'/goals',
	'/debts',
	'/settings',
	'/more',
] as const;

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const refreshToken = request.cookies.get('refreshToken')?.value;

	const isGuestPath = GUEST_PATHS.some(p => pathname.startsWith(p));
	const isProtectedPath = PROTECTED_PATHS.some(p => pathname.startsWith(p));

	if (isProtectedPath && !refreshToken) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (isGuestPath && refreshToken) {
		return NextResponse.redirect(new URL('/home', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/login',
		'/registration',
		'/home',
		'/transactions',
		'/analytics',
		'/goals',
		'/debts',
		'/settings',
		'/more',
		'/((?!_next|api|.*\\..*).*)',
	],
};

export const runtime = 'nodejs';
