import { NextRequest, NextResponse } from 'next/server';
import { verify, sign } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get('authToken')?.value;
	const refreshToken = request.cookies.get('refreshToken')?.value;

	// Гостевые страницы
	const guestPaths = ['/login', '/registration'];
	if (guestPaths.includes(pathname)) {
		if (token) {
			try {
				if (!token) throw new Error('Token is undefined');
				verify(token, JWT_SECRET);
				return NextResponse.redirect(new URL('/', request.url));
			} catch (error) {
				console.log(`[Middleware] Invalid token for guest path: ${error}`);
			}
		}
		return NextResponse.next();
	}

	// Защищенные страницы
	const protectedPaths = ['/', '/transactions', '/more'];
	if (protectedPaths.includes(pathname)) {
		if (!token) {
			if (!refreshToken) {
				return NextResponse.redirect(new URL('/login', request.url));
			}
		}

		try {
			if (!token) throw new Error('Token is undefined');
			verify(token, JWT_SECRET);
			return NextResponse.next();
		} catch (error) {
			if (!refreshToken) {
				return NextResponse.redirect(new URL('/login', request.url));
			}

			try {
				if (!refreshToken) throw new Error('Refresh token is undefined');
				const payload = verify(refreshToken, JWT_REFRESH_SECRET) as {
					userId: string;
					email: string;
				};
				const user = await prisma.user.findUnique({
					where: { id: payload.userId },
				});

				if (!user || user.refreshToken !== refreshToken) {
					throw new Error('Invalid refresh token');
				}

				const newAccessToken = sign(
					{ userId: user.id, email: user.email },
					JWT_SECRET,
					{ expiresIn: '15m' }
				);

				const response = NextResponse.next();
				response.cookies.set('authToken', newAccessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					path: '/',
					maxAge: 900,
				});

				return response;
			} catch (refreshError) {
				console.log(`[Middleware] Refresh failed: ${refreshError}`);
				return NextResponse.redirect(new URL('/login', request.url));
			}
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
		'/more',
		'/((?!_next|api|.*\\..*).*)',
	],
};

export const runtime = 'nodejs';
