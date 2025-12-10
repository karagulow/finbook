import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
	const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
	const data = await response.json();

	const valutes = data.Valute;

	const currencies = await prisma.currency.findMany();

	const rubCurrency = currencies.find(c => c.code === 'RUB');
	if (!rubCurrency) {
		return NextResponse.json(
			{ error: 'RUB currency not found' },
			{ status: 500 }
		);
	}

	const now = new Date();
	const operations = [];

	for (const currency of currencies) {
		if (currency.code === 'RUB') {
			operations.push(
				prisma.exchangeRate.upsert({
					where: { fromId_toId: { fromId: currency.id, toId: currency.id } },
					update: { rate: 1, date: now },
					create: {
						fromId: currency.id,
						toId: currency.id,
						rate: 1,
						date: now,
					},
				})
			);
			continue;
		}

		const cbData = valutes[currency.code];
		if (!cbData) continue;

		const valueRUB = cbData.Value;

		operations.push(
			prisma.exchangeRate.upsert({
				where: { fromId_toId: { fromId: currency.id, toId: rubCurrency.id } },
				update: { rate: valueRUB, date: now },
				create: {
					fromId: currency.id,
					toId: rubCurrency.id,
					rate: valueRUB,
					date: now,
				},
			})
		);

		const rateFromRub = 1 / valueRUB;

		operations.push(
			prisma.exchangeRate.upsert({
				where: { fromId_toId: { fromId: rubCurrency.id, toId: currency.id } },
				update: { rate: rateFromRub, date: now },
				create: {
					fromId: rubCurrency.id,
					toId: currency.id,
					rate: rateFromRub,
					date: now,
				},
			})
		);
	}

	await prisma.$transaction(operations);

	console.log('Курсы валют обновлены:', operations.length);

	return NextResponse.json({ success: true, updated: operations.length });
}
