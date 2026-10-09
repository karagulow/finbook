import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma/prisma-client';
import {
	buildWorkbook,
	exportFileName,
	resolveTimeZone,
	type ExportSections,
} from './build-workbook';

const JWT_SECRET = process.env.JWT_SECRET!;

const SECTION_KEYS = [
	'accounts',
	'categories',
	'transactions',
	'goals',
	'debts',
] as const;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const getUserId = async () => {
	const cookieStore = await cookies();
	const token = cookieStore.get('authToken')?.value;

	if (!token) {
		return null;
	}

	try {
		const decoded = verify(token, JWT_SECRET) as { userId: string };
		return decoded.userId;
	} catch {
		return null;
	}
};

const parseSections = (value: unknown): ExportSections | null => {
	if (!value || typeof value !== 'object') return null;

	const source = value as Record<string, unknown>;
	const sections = {} as ExportSections;

	for (const key of SECTION_KEYS) {
		if (typeof source[key] !== 'boolean') return null;
		sections[key] = source[key];
	}

	if (!SECTION_KEYS.some(key => sections[key])) return null;

	return sections;
};

const parseAccountIds = (value: unknown) => {
	if (value == null) return null;
	if (!Array.isArray(value) || value.length > 500) return 'invalid' as const;

	const ids = value.filter(
		(id): id is string => typeof id === 'string' && id.length > 0 && id.length < 100,
	);

	if (ids.length !== value.length) return 'invalid' as const;

	return ids;
};

const parseDate = (value: unknown) => {
	if (value == null) return null;
	if (typeof value !== 'string') return 'invalid' as const;

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return 'invalid' as const;

	return date;
};

const transactionWhere = (
	userId: string,
	accountIds: string[] | null,
	from: Date | null,
	to: Date | null,
): Prisma.TransactionWhereInput => {
	const where: Prisma.TransactionWhereInput = { userId };

	if (from || to) {
		where.date = {
			...(from ? { gte: from } : {}),
			...(to ? { lte: to } : {}),
		};
	}

	if (accountIds) {
		where.OR = [
			{ type: 'GOAL' },
			{
				type: 'DEBT',
				OR: [{ accountId: null }, { accountId: { in: accountIds } }],
			},
			{
				type: { in: ['INCOME', 'EXPENSE'] },
				accountId: { in: accountIds },
			},
			{
				type: 'TRANSFER',
				OR: [
					{ accountIdFrom: { in: accountIds } },
					{ accountIdTo: { in: accountIds } },
				],
			},
		];
	}

	return where;
};

export async function POST(req: Request) {
	try {
		const userId = await getUserId();

		if (!userId) {
			return NextResponse.json(
				{ message: 'Не авторизован' },
				{ status: 401 },
			);
		}

		const body = await req.json();
		const sections = parseSections(body?.sections);
		const accountIds = parseAccountIds(body?.accountIds);
		const from = parseDate(body?.from);
		const to = parseDate(body?.to);
		const timeZone = resolveTimeZone(body?.timeZone);

		if (!sections) {
			return NextResponse.json(
				{ message: 'Выберите, что включить в выгрузку' },
				{ status: 400 },
			);
		}

		if (accountIds === 'invalid' || from === 'invalid' || to === 'invalid') {
			return NextResponse.json(
				{ message: 'Проверьте параметры выгрузки' },
				{ status: 400 },
			);
		}

		if (from && to && from > to) {
			return NextResponse.json(
				{ message: 'Дата начала позже даты окончания' },
				{ status: 400 },
			);
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { currency: { select: { code: true } } },
		});

		if (!user) {
			return NextResponse.json(
				{ message: 'Пользователь не найден' },
				{ status: 404 },
			);
		}

		const [accounts, categories, transactions, goals, debts] = await Promise.all([
			sections.accounts
				? prisma.account.findMany({
						where: { userId },
						include: { currency: { select: { code: true } } },
						orderBy: { order: 'asc' },
					})
				: Promise.resolve([]),
			sections.categories
				? prisma.category.findMany({
						where: { userId },
						include: {
							subcategories: { orderBy: { createdAt: 'asc' } },
						},
						orderBy: { order: 'asc' },
					})
				: Promise.resolve([]),
			sections.transactions
				? prisma.transaction.findMany({
						where: transactionWhere(
							userId,
							sections.transactions ? accountIds : null,
							from,
							to,
						),
						include: {
							account: {
								include: { currency: { select: { code: true } } },
							},
							accountFrom: {
								include: { currency: { select: { code: true } } },
							},
							accountTo: {
								include: { currency: { select: { code: true } } },
							},
							category: { select: { name: true } },
							subcategory: { select: { name: true } },
							goal: { select: { name: true } },
							debt: { select: { name: true } },
						},
						orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
					})
				: Promise.resolve([]),
			sections.goals
				? prisma.goal.findMany({
						where: { userId },
						orderBy: [{ deadline: 'asc' }, { createdAt: 'asc' }],
					})
				: Promise.resolve([]),
			sections.debts
				? prisma.debt.findMany({
						where: {
							userId,
							...(accountIds
								? {
										OR: [
											{ accountId: null },
											{ accountId: { in: accountIds } },
										],
									}
								: {}),
						},
						include: {
							account: {
								include: { currency: { select: { code: true } } },
							},
						},
						orderBy: [{ deadline: 'asc' }, { createdAt: 'asc' }],
					})
				: Promise.resolve([]),
		]);

		const buffer = await buildWorkbook({
			timeZone,
			currencyCode: user.currency.code,
			sections,
			accounts: accounts.map(account => ({
				name: account.name,
				balance: account.balance,
				currency: account.currency,
			})),
			categories: categories.map(category => ({
				name: category.name,
				type: category.type,
				icon: category.icon,
				color: category.color,
				subcategories: category.subcategories.map(subcategory => ({
					name: subcategory.name,
				})),
			})),
			transactions: transactions.map(transaction => ({
				type: transaction.type,
				date: transaction.date,
				description: transaction.description,
				amount: transaction.amount,
				amountFrom: transaction.amountFrom,
				amountTo: transaction.amountTo,
				goalType: transaction.goalType,
				debtAction: transaction.debtAction,
				account: transaction.account,
				accountFrom: transaction.accountFrom,
				accountTo: transaction.accountTo,
				category: transaction.category,
				subcategory: transaction.subcategory,
				goal: transaction.goal,
				debt: transaction.debt,
			})),
			goals: goals.map(goal => ({
				name: goal.name,
				targetAmount: goal.target_amount,
				savedAmount: goal.saved_amount,
				deadline: goal.deadline,
				description: goal.description,
			})),
			debts: debts.map(debt => ({
				name: debt.name,
				type: debt.type,
				targetAmount: debt.target_amount,
				savedAmount: debt.saved_amount,
				paid: debt.paid,
				deadline: debt.deadline,
				description: debt.description,
				accountName: debt.account?.name ?? null,
				currencyCode: debt.account?.currency.code ?? user.currency.code,
			})),
		});

		const fileName = exportFileName(timeZone);

		return new NextResponse(buffer as unknown as BodyInit, {
			headers: {
				'Content-Type':
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'Content-Disposition': `attachment; filename="${fileName}"`,
				'Cache-Control': 'no-store',
			},
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
}
