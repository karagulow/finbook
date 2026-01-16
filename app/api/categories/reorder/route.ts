import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/prisma/prisma-client';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function PATCH(req: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('authToken')?.value;

		if (!token) {
			return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
		}

		let userId: string;
		try {
			const decoded = verify(token, JWT_SECRET) as { userId: string };
			userId = decoded.userId;
		} catch {
			return NextResponse.json(
				{ error: 'Токен недействителен или истёк' },
				{ status: 401 }
			);
		}

		const { orderedIds } = await req.json();

		await Promise.all(
			orderedIds.map((id: string, index: number) =>
				prisma.category.updateMany({
					where: { id, userId },
					data: { order: index },
				})
			)
		);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Ошибка при сохранении порядка' },
			{ status: 500 }
		);
	}
}
