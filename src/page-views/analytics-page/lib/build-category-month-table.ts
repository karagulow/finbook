import type { AnalyticsTransaction } from '../model/types';

export const MONTH_LABELS = [
	'Янв',
	'Фев',
	'Мар',
	'Апр',
	'Май',
	'Июн',
	'Июл',
	'Авг',
	'Сен',
	'Окт',
	'Ноя',
	'Дек',
] as const;

const UNCATEGORIZED_ID = 'uncategorized';
const UNCATEGORIZED_COLOR = '#969799';

export type CategoryMonthRow = {
	id: string;
	name: string;
	color: string;
	months: number[];
	total: number;
};

export type CategoryMonthTableData = {
	incomes: CategoryMonthRow[];
	expenses: CategoryMonthRow[];
	incomeMonths: number[];
	expenseMonths: number[];
	incomeTotal: number;
	expenseTotal: number;
};

const emptyMonths = () => Array.from({ length: 12 }, () => 0);

const sortRows = (rows: CategoryMonthRow[]) =>
	rows.sort(
		(a, b) => b.total - a.total || a.name.localeCompare(b.name, 'ru'),
	);

export const buildCategoryMonthTable = (
	transactions: AnalyticsTransaction[],
	year: number,
): CategoryMonthTableData => {
	const incomeMap = new Map<string, CategoryMonthRow>();
	const expenseMap = new Map<string, CategoryMonthRow>();
	const incomeMonths = emptyMonths();
	const expenseMonths = emptyMonths();

	for (const tx of transactions) {
		if (tx.type !== 'INCOME' && tx.type !== 'EXPENSE') continue;

		const date = new Date(tx.date);
		if (date.getFullYear() !== year) continue;

		const month = date.getMonth();
		const amount = tx.amountInUserCurrency ?? 0;
		const map = tx.type === 'INCOME' ? incomeMap : expenseMap;
		const monthTotals = tx.type === 'INCOME' ? incomeMonths : expenseMonths;
		monthTotals[month] += amount;

		const id = tx.category?.id ?? UNCATEGORIZED_ID;
		const row = map.get(id) ?? {
			id,
			name: tx.category?.name ?? 'Без категории',
			color: tx.category?.color || UNCATEGORIZED_COLOR,
			months: emptyMonths(),
			total: 0,
		};

		row.months[month] += amount;
		row.total += amount;
		map.set(id, row);
	}

	const sum = (months: number[]) =>
		months.reduce((total, value) => total + value, 0);

	return {
		incomes: sortRows([...incomeMap.values()]),
		expenses: sortRows([...expenseMap.values()]),
		incomeMonths,
		expenseMonths,
		incomeTotal: sum(incomeMonths),
		expenseTotal: sum(expenseMonths),
	};
};
