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
	transactions: AnalyticsTransaction[] = []
) => {
	return useMemo(() => {
		const monthly = Array.from({ length: 12 }, (_, i) => ({
			label: monthLabels[i],
			income: 0,
			expense: 0,
		}));

		for (const tx of transactions) {
			const date = new Date(tx.date);
			const month = date.getMonth();
			if (tx.type === 'INCOME') {
				monthly[month].income += tx.amountInUserCurrency ?? 0;
			} else if (tx.type === 'EXPENSE') {
				monthly[month].expense += tx.amountInUserCurrency ?? 0;
			}
		}

		return monthly;
	}, [transactions]);
};
