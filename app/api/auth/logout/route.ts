import { NextResponse } from 'next/server';

export async function POST() {
	return NextResponse.json(
		{ message: 'Вы вышли из системы' },
		{
			status: 200,
			headers: {
				'Set-Cookie': `authToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
			},
		}
	);
}
