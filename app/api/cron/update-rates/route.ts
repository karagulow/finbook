import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
	const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
	const data = await response.json();

	const valutes = data.Valute;

	// Главное: RUB — базовая валюта
	// У ЦБ нет записи для RUB, поэтому считаем курс RUB = 1
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
		const fromId = currency.id;

		// 1) RUB -> RUB = 1
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

		// 2) Берем данные по валюте
		const cbData = valutes[currency.code];
		if (!cbData) continue; // валюты нет у ЦБ

		const valueRUB = cbData.Value; // сколько рублей стоит 1 единица валюты

		// 3) Запись: валюта -> RUB
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

		// 4) Запись: RUB -> валюта (обратный курс)
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
