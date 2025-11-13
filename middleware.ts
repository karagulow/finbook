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

	const guestPaths = ['/login', '/registration'];
	const protectedPaths = [
		'/',
		'/transactions',
		'/analytics',
		'/goals',
		'/debts',
		'/settings',
		'/more',
	];

	// Гостевые страницы
	if (guestPaths.includes(pathname)) {
		if (token) {
			try {
				verify(token, JWT_SECRET);
				return NextResponse.redirect(new URL('/', request.url));
			} catch {}
		}
		return NextResponse.next();
	}

	// Защищенные страницы
	if (protectedPaths.includes(pathname)) {
		if (token) {
			try {
				verify(token, JWT_SECRET);
				return NextResponse.next();
			} catch {
				// токен истек — будем пробовать refresh
			}
		}

		if (refreshToken) {
			try {
				const payload = verify(refreshToken, JWT_REFRESH_SECRET) as {
					userId: string;
					email: string;
				};
				const user = await prisma.user.findUnique({
					where: { id: payload.userId },
					include: { refreshTokens: true },
				});
				if (!user) throw new Error('No user');

				const isValid = user.refreshTokens.some(
					rt => rt.token === refreshToken
				);
				if (!isValid) throw new Error('Invalid refresh token');

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
			} catch {
				return NextResponse.redirect(new URL('/login', request.url));
			}
		}

		return NextResponse.redirect(new URL('/login', request.url));
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
