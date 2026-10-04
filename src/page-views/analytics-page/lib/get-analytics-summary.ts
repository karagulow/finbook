import type { AnalyticsTransaction } from '../model/types';

const MONTHS_DATIVE = [
	'январю',
	'февралю',
	'марту',
	'апрелю',
	'маю',
	'июню',
	'июлю',
	'августу',
	'сентябрю',
	'октябрю',
	'ноябрю',
	'декабрю',
];

const MONTHS_ACCUSATIVE = [
	'январь',
	'февраль',
	'март',
	'апрель',
	'май',
	'июнь',
	'июль',
	'август',
	'сентябрь',
	'октябрь',
	'ноябрь',
	'декабрь',
];

export type AnalyticsSummary = {
	income: number;
	expense: number;
	difference: number;
	incomeChange: number | null;
	expenseChange: number | null;
	differenceChange: number | null;
	compareLabel: string;
	noDataCaption: string;
	averageTitle: string;
	averageExpense: number;
};

type GetAnalyticsSummaryParams = {
	transactions: AnalyticsTransaction[];
	previousYearTransactions: AnalyticsTransaction[];
	period: 'year' | 'month';
	year: number;
	month: number;
	now?: Date;
};

const sumByType = (
	transactions: AnalyticsTransaction[],
	type: AnalyticsTransaction['type'],
	year: number,
	month?: number,
) => {
	let total = 0;

	for (const tx of transactions) {
		if (tx.type !== type) continue;

		const date = new Date(tx.date);
		if (date.getFullYear() !== year) continue;
		if (month !== undefined && date.getMonth() !== month) continue;

		total += tx.amountInUserCurrency ?? 0;
	}

	return total;
};

const percentChange = (current: number, previous: number) => {
	if (previous === 0) return null;

	return ((current - previous) / Math.abs(previous)) * 100;
};

const totals = (
	transactions: AnalyticsTransaction[],
	year: number,
	month?: number,
) => {
	const income = sumByType(transactions, 'INCOME', year, month);
	const expense = sumByType(transactions, 'EXPENSE', year, month);

	return { income, expense, difference: income - expense };
};

export const getAnalyticsSummary = ({
	transactions,
	previousYearTransactions,
	period,
	year,
	month,
	now = new Date(),
}: GetAnalyticsSummaryParams): AnalyticsSummary => {
	const current = totals(
		transactions,
		year,
		period === 'month' ? month : undefined,
	);

	const previousMonth = month === 0 ? 11 : month - 1;
	const previous =
		period === 'year'
			? totals(previousYearTransactions, year - 1)
			: month === 0
				? totals(previousYearTransactions, year - 1, 11)
				: totals(transactions, year, month - 1);

	const isCurrentMonth =
		year === now.getFullYear() && month === now.getMonth();
	const isCurrentYear = year === now.getFullYear();

	const averageExpense =
		period === 'month'
			? current.expense /
				(isCurrentMonth
					? now.getDate()
					: new Date(year, month + 1, 0).getDate())
			: current.expense / (isCurrentYear ? now.getMonth() + 1 : 12);

	return {
		...current,
		incomeChange: percentChange(current.income, previous.income),
		expenseChange: percentChange(current.expense, previous.expense),
		differenceChange: percentChange(current.difference, previous.difference),
		compareLabel:
			period === 'year' ? String(year - 1) : MONTHS_DATIVE[previousMonth],
		noDataCaption: `нет данных за ${
			period === 'year' ? year - 1 : MONTHS_ACCUSATIVE[previousMonth]
		}`,
		averageTitle: period === 'month' ? 'В день' : 'В месяц',
		averageExpense,
	};
};
