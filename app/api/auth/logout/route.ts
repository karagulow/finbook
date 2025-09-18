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
			await prisma.user.updateMany({
				where: { refreshToken },
				data: { refreshToken: null },
			});
		}

		return NextResponse.json(
			{ message: 'Вы вышли из системы' },
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
		return NextResponse.json(
			{ message: 'Ошибка при логауте' },
			{ status: 500 }
		);
	}
}
