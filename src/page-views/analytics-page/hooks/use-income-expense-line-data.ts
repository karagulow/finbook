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
			}));

			for (const tx of transactions) {
				const date = new Date(tx.date);
				if (date.getFullYear() !== year || date.getMonth() !== month) continue;

				const day = date.getDate() - 1;
				if (tx.type === 'INCOME') {
					daily[day].income += tx.amountInUserCurrency ?? 0;
				} else if (tx.type === 'EXPENSE') {
					daily[day].expense += tx.amountInUserCurrency ?? 0;
				}
			}

			return daily;
		}

		const monthly = Array.from({ length: 12 }, (_, i) => ({
			label: monthLabels[i],
			income: 0,
			expense: 0,
		}));

		for (const tx of transactions) {
			const date = new Date(tx.date);
			const txMonth = date.getMonth();
			if (tx.type === 'INCOME') {
				monthly[txMonth].income += tx.amountInUserCurrency ?? 0;
			} else if (tx.type === 'EXPENSE') {
				monthly[txMonth].expense += tx.amountInUserCurrency ?? 0;
			}
		}

		return monthly;
	}, [transactions, period, year, month]);
};
