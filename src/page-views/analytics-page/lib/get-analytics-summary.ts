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

const MONTHS_GENITIVE = [
	'января',
	'февраля',
	'марта',
	'апреля',
	'мая',
	'июня',
	'июля',
	'августа',
	'сентября',
	'октября',
	'ноября',
	'декабря',
];

const MONTHS_SHORT = [
	'янв',
	'фев',
	'мар',
	'апр',
	'мая',
	'июн',
	'июл',
	'авг',
	'сен',
	'окт',
	'ноя',
	'дек',
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

type PeriodBound = {
	year: number;
	month?: number;
	until?: { month: number; day: number };
};

const daysInMonth = (year: number, month: number) =>
	new Date(year, month + 1, 0).getDate();

const clampDay = (year: number, month: number, day: number) =>
	Math.min(day, daysInMonth(year, month));

const inBound = (date: Date, bound: PeriodBound) => {
	if (date.getFullYear() !== bound.year) return false;
	if (bound.month !== undefined && date.getMonth() !== bound.month) return false;
	if (!bound.until) return true;
	if (date.getMonth() > bound.until.month) return false;
	if (
		date.getMonth() === bound.until.month &&
		date.getDate() > bound.until.day
	) {
		return false;
	}

	return true;
};

const sumByType = (
	transactions: AnalyticsTransaction[],
	type: AnalyticsTransaction['type'],
	bound: PeriodBound,
) => {
	let total = 0;

	for (const tx of transactions) {
		if (tx.type !== type) continue;
		if (!inBound(new Date(tx.date), bound)) continue;

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
	bound: PeriodBound,
) => {
	const income = sumByType(transactions, 'INCOME', bound);
	const expense = sumByType(transactions, 'EXPENSE', bound);

	return { income, expense, difference: income - expense };
};

const monthRangeLabel = (month: number, day: number, year?: number) => {
	const name = MONTHS_GENITIVE[month];
	const dates = day === 1 ? `1 ${name}` : `1–${day} ${name}`;
	return year === undefined ? dates : `${dates} ${year}`;
};

const yearRangeLabel = (month: number, day: number, year: number) => {
	if (month === 0) {
		return day === 1 ? `1 янв ${year}` : `1–${day} янв ${year}`;
	}

	return `1 янв — ${day} ${MONTHS_SHORT[month]} ${year}`;
};

export const getAnalyticsSummary = ({
	transactions,
	previousYearTransactions,
	period,
	year,
	month,
	now = new Date(),
}: GetAnalyticsSummaryParams): AnalyticsSummary => {
	const isCurrentYear = year === now.getFullYear();
	const isCurrentMonth = isCurrentYear && month === now.getMonth();
	const openYear = period === 'year' && isCurrentYear;
	const openMonth = period === 'month' && isCurrentMonth;

	const previousMonth = month === 0 ? 11 : month - 1;
	const previousMonthYear = month === 0 ? year - 1 : year;

	const currentBound: PeriodBound = openYear
		? { year, until: { month: now.getMonth(), day: now.getDate() } }
		: openMonth
			? { year, month, until: { month, day: now.getDate() } }
			: period === 'month'
				? { year, month }
				: { year };

	const previousBound: PeriodBound = openYear
		? {
				year: year - 1,
				until: {
					month: now.getMonth(),
					day: clampDay(year - 1, now.getMonth(), now.getDate()),
				},
			}
		: openMonth
			? {
					year: previousMonthYear,
					month: previousMonth,
					until: {
						month: previousMonth,
						day: clampDay(previousMonthYear, previousMonth, now.getDate()),
					},
				}
			: period === 'month'
				? { year: previousMonthYear, month: previousMonth }
				: { year: year - 1 };

	const source = (bound: PeriodBound) =>
		bound.year === year ? transactions : previousYearTransactions;

	const current = totals(
		transactions,
		period === 'month' ? { year, month } : { year },
	);
	const currentWindow = totals(source(currentBound), currentBound);
	const previousWindow = totals(source(previousBound), previousBound);

	const compareLabel = openYear
		? yearRangeLabel(
				previousBound.until!.month,
				previousBound.until!.day,
				previousBound.year,
			)
		: openMonth
			? monthRangeLabel(
					previousMonth,
					previousBound.until!.day,
					previousMonthYear === year ? undefined : previousMonthYear,
				)
			: period === 'year'
				? String(year - 1)
				: MONTHS_DATIVE[previousMonth];

	const noDataPeriod =
		openYear || openMonth
			? compareLabel
			: period === 'year'
				? String(year - 1)
				: MONTHS_ACCUSATIVE[previousMonth];

	const averageExpense =
		period === 'month'
			? current.expense /
				(isCurrentMonth ? now.getDate() : daysInMonth(year, month))
			: current.expense / (isCurrentYear ? now.getMonth() + 1 : 12);

	return {
		...current,
		incomeChange: percentChange(currentWindow.income, previousWindow.income),
		expenseChange: percentChange(currentWindow.expense, previousWindow.expense),
		differenceChange: percentChange(
			currentWindow.difference,
			previousWindow.difference,
		),
		compareLabel,
		noDataCaption: `нет данных за ${noDataPeriod}`,
		averageTitle: period === 'month' ? 'В день' : 'В месяц',
		averageExpense,
	};
};
