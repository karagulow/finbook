import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { prisma } from './prisma/prisma-client';

const JWT_SECRET = process.env.JWT_SECRET!;

const GUEST_PATHS = ['/login', '/registration'] as const;
const PROTECTED_PATHS = [
	'/',
	'/transactions',
	'/analytics',
	'/goals',
	'/debts',
	'/settings',
	'/more',
] as const;

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get('authToken')?.value;
	const refreshToken = request.cookies.get('refreshToken')?.value;

	let session = null;
	if (refreshToken) {
		session = await prisma.refreshToken.findUnique({
			where: { token: refreshToken },
		});
	}

	const refreshInvalid =
		!refreshToken ||
		!session ||
		session.revoked ||
		session.expiresAt < new Date();

	// ---------- ГОСТЕВЫЕ ----------
	if (GUEST_PATHS.includes(pathname as any)) {
		if (accessToken && !refreshInvalid) {
			return NextResponse.redirect(new URL('/', request.url));
		}

		if (refreshToken && refreshInvalid) {
			const res = NextResponse.next();
			res.cookies.delete('authToken');
			res.cookies.delete('refreshToken');
			return res;
		}

		return NextResponse.next();
	}

	// ---------- ЗАЩИЩЁННЫЕ ----------
	const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));

	if (isProtected) {
		if (!accessToken && refreshInvalid) {
			return NextResponse.redirect(new URL('/login', request.url));
		}

		if (!accessToken && !refreshInvalid) {
			return NextResponse.next();
		}

		try {
			if (refreshInvalid) {
				const res = NextResponse.redirect(new URL('/login', request.url));
				res.cookies.delete('authToken');
				res.cookies.delete('refreshToken');
				return res;
			}

			verify(accessToken!, JWT_SECRET);
			return NextResponse.next();
		} catch {
			if (!refreshInvalid) {
				return NextResponse.next();
			}

			const res = NextResponse.redirect(new URL('/login', request.url));
			res.cookies.delete('authToken');
			res.cookies.delete('refreshToken');
			return res;
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/',
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
