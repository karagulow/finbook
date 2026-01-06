import { NextRequest, NextResponse } from 'next/server';

const GUEST_PATHS = ['/login', '/registration'] as const;
const PROTECTED_PATHS = [
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

	const isRoot = pathname === '/';

	const isGuestPath = GUEST_PATHS.some(p => pathname.startsWith(p));
	const isProtectedPath =
		isRoot || PROTECTED_PATHS.some(p => pathname.startsWith(p));

	if (isProtectedPath && !refreshToken) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (isGuestPath && refreshToken) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/login',
		'/registration',
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
