import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
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

		const { currencyId } = await req.json();
		if (!currencyId)
			return NextResponse.json(
				{ error: 'Currency ID required' },
				{ status: 400 }
			);

		const currency = await prisma.currency.findUnique({
			where: { id: currencyId },
		});
		if (!currency)
			return NextResponse.json(
				{ error: 'Currency not found' },
				{ status: 404 }
			);

		await prisma.user.update({
			where: { id: userId },
			data: { currencyId },
		});

		return NextResponse.json({ message: 'Currency updated successfully' });
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		console.error('Неизвестная ошибка', error);
		return NextResponse.json({ error: 'Неизвестная ошибка' }, { status: 500 });
	}
}
