import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, CategoryType } from '@prisma/client';
import { baseCategories } from '@/constants/base-categories';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
	if (!JWT_SECRET) {
		return NextResponse.json(
			{ message: 'Серверная ошибка: JWT_SECRET не настроен' },
			{ status: 500 }
		);
	}

	try {
		const { email, password } = await req.json();

		if (await prisma.user.findUnique({ where: { email } })) {
			return NextResponse.json(
				{ message: 'Email уже используется' },
				{ status: 400 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const defaultCurrency = await prisma.currency.findUnique({
			where: { code: 'RUB' },
		});
		if (!defaultCurrency) {
			return NextResponse.json(
				{ message: 'Произошла ошибка с валютами' },
				{ status: 500 }
			);
		}

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				currencyId: defaultCurrency.id,
				accounts: {
					create: {
						name: 'Наличные',
						balance: 0,
						currencyId: defaultCurrency.id,
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
						})),
						...baseCategories.EXPENSE.map(cat => ({
							name: cat.name,
							type: CategoryType.EXPENSE,
							icon: cat.icon,
							color: cat.color,
							subcategories: {
								create: cat.subcategories.map(name => ({ name })),
							},
						})),
					],
				},
			},
		});

		const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
			expiresIn: '1h',
		});

		const refreshToken = jwt.sign(
			{ userId: user.id, email: user.email },
			JWT_SECRET,
			{ expiresIn: '7d' }
		);

		await prisma.user.update({
			where: { id: user.id },
			data: { refreshToken },
		});

		return NextResponse.json(
			{ message: 'Регистрация успешна' },
			{
				status: 201,
				headers: {
					'Set-Cookie': [
						`authToken=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
						`refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${
							7 * 24 * 60 * 60
						}`,
					].join('; '),
				},
			}
		);
	} catch (error) {
		console.error('Registration error:', error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
