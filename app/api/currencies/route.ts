import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';

export async function GET() {
	try {
		const currencies = await prisma.currency.findMany({
			select: { id: true, code: true, name: true, symbol: true },
			orderBy: { name: 'asc' },
		});

		return NextResponse.json(currencies);
	} catch (error) {
		console.error('Ошибка при загрузке валют:', error);
		return NextResponse.json(
			{ message: 'Ошибка при загрузке валют' },
			{ status: 500 }
		);
	}
}
