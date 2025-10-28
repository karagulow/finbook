import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
	try {
		const token = req.cookies.get('authToken')?.value;
		if (!token) {
			return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
		}

		const decoded = verify(token, JWT_SECRET) as { userId: string };

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			include: {
				currency: true,
				accounts: { include: { currency: true } },
			},
		});

		if (!user) {
			return NextResponse.json(
				{ message: 'Пользователь не найден' },
				{ status: 404 }
			);
		}

		let total = 0;

		for (const acc of user.accounts) {
			if (acc.currencyId === user.currencyId) {
				total += acc.balance;
				continue;
			}

			let rateRecord = await prisma.exchangeRate.findFirst({
				where: { fromId: acc.currencyId, toId: user.currencyId },
				orderBy: { date: 'desc' },
			});

			if (rateRecord) {
				total += acc.balance * rateRecord.rate;
				continue;
			}

			rateRecord = await prisma.exchangeRate.findFirst({
				where: { fromId: user.currencyId, toId: acc.currencyId },
				orderBy: { date: 'desc' },
			});

			if (rateRecord) {
				total += acc.balance / rateRecord.rate;
			} else {
				console.warn(
					`[Balance API] Нет курса для ${acc.currency.code} → ${user.currency.code}`
				);
			}
		}

		return NextResponse.json({
			total,
			currencyCode: user.currency.code,
			currencySymbol: user.currency.symbol,
		});
	} catch (error) {
		console.error('[Balance API] Ошибка:', error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
