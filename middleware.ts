import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get('authToken')?.value;

	// Гостевые страницы
	const guestPaths = ['/login', '/registration'];
	if (guestPaths.includes(pathname)) {
		if (token) {
			try {
				const decoded = verify(token, JWT_SECRET);
				return NextResponse.redirect(new URL('/', request.url));
			} catch (error) {
				console.log(`[Middleware] Invalid token for guest path: ${error}`);
			}
		}
		return NextResponse.next();
	}

	// Защищенные страницы
	const protectedPaths = ['/'];
	if (protectedPaths.includes(pathname)) {
		if (!token) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
		try {
			const decoded = verify(token, JWT_SECRET);
			return NextResponse.next();
		} catch (error) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/', '/login', '/registration', '/((?!_next|api|.*\\..*).*)'],
};

export const runtime = 'nodejs';
