import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

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

	// 1. Гостевые страницы — если уже залогинен → домой
	if (GUEST_PATHS.includes(pathname as any)) {
		if (accessToken || refreshToken) {
			return NextResponse.redirect(new URL('/', request.url));
		}

		return NextResponse.next();
	}

	// 2. Защищённые страницы
	const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));

	if (isProtected) {
		if (!accessToken) {
			if (refreshToken) {
				return NextResponse.next();
			}

			return NextResponse.redirect(new URL('/login', request.url));
		}

		try {
			verify(accessToken, JWT_SECRET);
			return NextResponse.next();
		} catch {
			return NextResponse.next();
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
