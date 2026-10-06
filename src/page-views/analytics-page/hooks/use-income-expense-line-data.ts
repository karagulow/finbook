'use client';

import { useMemo } from 'react';
import { AnalyticsTransaction } from '../model/types';

const monthLabels = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь',
];

export const useIncomeExpenseLineData = (
	transactions: AnalyticsTransaction[] = [],
	period: 'month' | 'year' = 'year',
	year = new Date().getFullYear(),
	month = new Date().getMonth(),
) => {
	return useMemo(() => {
		if (period === 'month') {
			const daysInMonth = new Date(year, month + 1, 0).getDate();
			const daily = Array.from({ length: daysInMonth }, (_, i) => ({
				label: String(i + 1),
				income: 0,
				expense: 0,
				categories: [] as { name: string; amount: number }[],
			}));
			const categoriesByDay = Array.from(
				{ length: daysInMonth },
				() => new Map<string, { name: string; amount: number }>(),
			);

			for (const tx of transactions) {
				const date = new Date(tx.date);
				if (date.getFullYear() !== year || date.getMonth() !== month) continue;

				const day = date.getDate() - 1;
				const amount = tx.amountInUserCurrency ?? 0;
				if (tx.type === 'INCOME') {
					daily[day].income += amount;
				} else if (tx.type === 'EXPENSE') {
					daily[day].expense += amount;
					const name = tx.category?.name || 'Без категории';
					const key = tx.category?.id || name;
					const prev = categoriesByDay[day].get(key) ?? { name, amount: 0 };
					categoriesByDay[day].set(key, {
						name,
						amount: prev.amount + amount,
					});
				}
			}

			return daily.map((point, day) => ({
				...point,
				categories: Array.from(categoriesByDay[day].values()).sort(
					(a, b) => b.amount - a.amount,
				),
			}));
		}

		const monthly = Array.from({ length: 12 }, (_, i) => ({
			label: monthLabels[i],
			income: 0,
			expense: 0,
			categories: [] as { name: string; amount: number }[],
		}));
		const categoriesByMonth = Array.from(
			{ length: 12 },
			() => new Map<string, { name: string; amount: number }>(),
		);

		for (const tx of transactions) {
			const date = new Date(tx.date);
			const txMonth = date.getMonth();
			const amount = tx.amountInUserCurrency ?? 0;
			if (tx.type === 'INCOME') {
				monthly[txMonth].income += amount;
			} else if (tx.type === 'EXPENSE') {
				monthly[txMonth].expense += amount;
				const name = tx.category?.name || 'Без категории';
				const key = tx.category?.id || name;
				const prev = categoriesByMonth[txMonth].get(key) ?? { name, amount: 0 };
				categoriesByMonth[txMonth].set(key, {
					name,
					amount: prev.amount + amount,
				});
			}
		}

		return monthly.map((point, txMonth) => ({
			...point,
			categories: Array.from(categoriesByMonth[txMonth].values()).sort(
				(a, b) => b.amount - a.amount,
			),
		}));
	}, [transactions, period, year, month]);
};
