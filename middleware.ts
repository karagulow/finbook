import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import {
	PIN_ENABLED_COOKIE,
	PIN_UNLOCK_COOKIE,
	PIN_WINDOW_COOKIE,
	authCookieOptions,
} from '@/src/shared/lib/pin-constants';

const JWT_SECRET = process.env.JWT_SECRET;

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

function accessTokenRequiresPin(token: string | undefined) {
	if (!token || !JWT_SECRET) {
		return false;
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { pin?: boolean };
		return decoded.pin === true;
	} catch {
		return false;
	}
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const refreshToken = request.cookies.get('refreshToken')?.value;
	const authToken = request.cookies.get('authToken')?.value;
	const pinUnlock = request.cookies.get(PIN_UNLOCK_COOKIE)?.value;
	const pinWindow = request.cookies.get(PIN_WINDOW_COOKIE)?.value === '1';
	const pinEnabled = request.cookies.get(PIN_ENABLED_COOKIE)?.value === '1';
	const needsPin = pinEnabled || accessTokenRequiresPin(authToken);
	const unlocked = Boolean(pinUnlock) && pinWindow;

	const isGuestPath = GUEST_PATHS.some(p => pathname.startsWith(p));
	const isProtectedPath = PROTECTED_PATHS.some(p => pathname.startsWith(p));
	const isLockPath = pathname === '/lock' || pathname.startsWith('/lock/');

	if ((isProtectedPath || isLockPath) && !refreshToken) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (isProtectedPath && needsPin && !unlocked) {
		const next = encodeURIComponent(pathname);
		const response = NextResponse.redirect(
			new URL(`/lock?next=${next}`, request.url),
		);

		response.cookies.set('authToken', '', { ...authCookieOptions, maxAge: 0 });

		return response;
	}

	if (isLockPath && unlocked) {
		return NextResponse.redirect(new URL('/home', request.url));
	}

	if (isGuestPath && refreshToken) {
		if (needsPin && !unlocked) {
			return NextResponse.redirect(new URL('/lock', request.url));
		}

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
		'/lock',
		'/((?!_next|api|.*\\..*).*)',
	],
};

export const runtime = 'nodejs';
