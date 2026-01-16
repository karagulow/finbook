import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, CategoryType } from '@prisma/client';
import { baseCategories } from '@/constants/base-categories';
import { UAParser } from 'ua-parser-js';
import crypto from 'crypto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export async function POST(req: Request) {
	if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
		return NextResponse.json(
			{ message: 'Произошла внутренняя ошибка сервера. Попробуйте позже.' },
			{ status: 500 }
		);
	}

	try {
		const { email, password, currencyId } = await req.json();

		const userAgent = req.headers.get('user-agent') ?? '';
		const parser = new UAParser(userAgent);
		const uaResult = parser.getResult();
		const deviceInfo = `${uaResult.browser.name} on ${uaResult.os.name} ${
			uaResult.os.version ?? ''
		}`.trim();

		if (await prisma.user.findUnique({ where: { email } })) {
			return NextResponse.json(
				{ message: 'Этот email уже зарегистрирован.' },
				{ status: 400 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const selectedCurrency = await prisma.currency.findUnique({
			where: { id: currencyId },
		});

		if (!selectedCurrency) {
			return NextResponse.json(
				{ message: 'Выбранная валюта недоступна.' },
				{ status: 400 }
			);
		}

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				currencyId: selectedCurrency.id,
				accounts: {
					create: {
						name: 'Основной счёт',
						balance: 0,
						currencyId: selectedCurrency.id,
					},
				},
				categories: {
					create: [
						...baseCategories.INCOME.map(cat => ({
							name: cat.name,
							type: CategoryType.INCOME,
							icon: cat.icon,
							color: cat.color,
							subcategories: {
								create: cat.subcategories.map(name => ({ name })),
							},
							order: cat.order,
						})),
						...baseCategories.EXPENSE.map(cat => ({
							name: cat.name,
							type: CategoryType.EXPENSE,
							icon: cat.icon,
							color: cat.color,
							subcategories: {
								create: cat.subcategories.map(name => ({ name })),
							},
							order: cat.order,
						})),
					],
				},
			},
		});

		const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
			expiresIn: '15m',
		});

		const jti = crypto.randomUUID();

		const refreshToken = jwt.sign(
			{ userId: user.id, email: user.email, jti },
			JWT_REFRESH_SECRET,
			{ expiresIn: '30d' }
		);

		await prisma.refreshToken.create({
			data: {
				id: jti,
				token: refreshToken,
				userId: user.id,
				expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				deviceInfo,
			},
		});

		const response = NextResponse.json(
			{ message: 'Вы успешно зарегистрировались!', token },
			{ status: 201 }
		);

		response.cookies.set('authToken', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 900,
		});

		response.cookies.set('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 30 * 24 * 60 * 60,
		});

		return response;
	} catch (error) {
		console.error('Registration error:', error);
		return NextResponse.json(
			{ message: 'Не удалось зарегистрироваться. Попробуйте ещё раз.' },
			{ status: 500 }
		);
	}
}
