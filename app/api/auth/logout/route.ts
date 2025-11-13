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
			await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
		}

		return NextResponse.json(
			{ message: 'Вы успешно вышли из системы.' },
			{
				status: 200,
				headers: {
					'Set-Cookie': [
						`authToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
						`refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
					].join(', '),
				},
			}
		);
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
