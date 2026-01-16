import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
	try {
		const cookies = req.headers.get('cookie') ?? '';
		const refreshToken = cookies
			.split('; ')
			.find(row => row.startsWith('refreshToken='))
			?.split('=')[1];

		if (refreshToken) {
			await prisma.refreshToken.updateMany({
				where: { token: refreshToken },
				data: { revoked: true },
			});
		}

		const response = NextResponse.json(
			{ message: 'Вы успешно вышли из системы.' },
			{ status: 200 }
		);

		response.cookies.set('authToken', '', {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 0,
		});

		response.cookies.set('refreshToken', '', {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 0,
		});

		return response;
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{
				message: 'Не удалось выйти из системы. Попробуйте ещё раз чуть позже.',
			},
			{ status: 500 }
		);
	}
}
