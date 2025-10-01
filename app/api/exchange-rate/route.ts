import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const fromId = searchParams.get('from');
		const toId = searchParams.get('to');

		if (!fromId || !toId) {
			return NextResponse.json(
				{ error: 'from и to обязательны' },
				{ status: 400 }
			);
		}

		const directRate = await prisma.exchangeRate.findFirst({
			where: { fromId, toId },
			orderBy: { date: 'desc' },
		});

		if (directRate) {
			return NextResponse.json({ rate: directRate.rate });
		}

		const reverseRate = await prisma.exchangeRate.findFirst({
			where: { fromId: toId, toId: fromId },
			orderBy: { date: 'desc' },
		});

		if (reverseRate) {
			return NextResponse.json({ rate: 1 / reverseRate.rate });
		}

		return NextResponse.json({ rate: null });
	} catch (error) {
		console.error('Ошибка при получении курса валют:', error);
		return NextResponse.json(
			{ error: 'Ошибка при получении курса валют' },
			{ status: 500 }
		);
	}
}
