'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { useBalance } from '@/src/entities/balance';
import {
	CategoryDoughnutChart,
	CategoryDoughnutChartSkeleton,
	DailyExpenseBarChart,
	DailyExpenseBarChartSkeleton,
	IncomeExpenseLineChart,
	IncomeExpenseLineChartSkeleton,
	StickyHeader,
} from '@/src/shared/ui';
import { useAnalyticsYears } from '../hooks/use-analytics-years';
import { useYearlyTransactions } from '../hooks/use-transactions';
import { useIncomeExpenseLineData } from '../hooks/use-income-expense-line-data';
import { useTransactionsByCategoryYearly } from '../hooks/use-transactions-by-category';
import { getAnalyticsSummary } from '../lib/get-analytics-summary';
import { AnalyticsFilters, type AnalyticsPeriod } from './analytics-filters';
import { AnalyticsSummary } from './analytics-summary';
import { AnalyticsSummarySkeleton } from './analytics-summary-skeleton';

export const AnalyticsPage: React.FC = () => {
	const now = new Date();
	const [period, setPeriod] = useState<AnalyticsPeriod>('Год');
	const [year, setYear] = useState(now.getFullYear());
	const [month, setMonth] = useState(now.getMonth());
	const years = useAnalyticsYears();

	useEffect(() => {
		if (!years.includes(year)) {
			setYear(years[0]);
		}
	}, [years, year]);

	const { transactions, loading } = useYearlyTransactions(year);
	const { transactions: previousYearTransactions, loading: previousLoading } =
		useYearlyTransactions(year - 1);
	const { currencySymbol, currencyCode } = useBalance();
	const currency = currencySymbol || currencyCode || '₽';
	const linePeriod = period === 'Месяц' ? 'month' : 'year';
	const needsPreviousYear = linePeriod === 'year' || month === 0;
	const lineData = useIncomeExpenseLineData(
		transactions ?? [],
		linePeriod,
		year,
		month,
	);

	const periodTransactions = useMemo(() => {
		if (period === 'Год') return transactions ?? [];

		return (transactions ?? []).filter(tx => {
			const date = new Date(tx.date);
			return date.getFullYear() === year && date.getMonth() === month;
		});
	}, [transactions, period, year, month]);

	const { incomes, expenses } =
		useTransactionsByCategoryYearly(periodTransactions);

	const summary = useMemo(
		() =>
			getAnalyticsSummary({
				transactions: transactions ?? [],
				previousYearTransactions: previousYearTransactions ?? [],
				period: linePeriod,
				year,
				month,
			}),
		[transactions, previousYearTransactions, linePeriod, year, month],
	);

	const summaryLoading = loading || (needsPreviousYear && previousLoading);

	return (
		<>
			<StickyHeader title='Аналитика' />

			<div className='flex flex-col gap-5 sm:gap-[30px]'>
				<div className='flex flex-col items-start gap-2.5 md:flex-row md:items-center md:justify-between'>
					<h1 className='font-medium text-[24px] text-[var(--foreground-primary)]'>
						Аналитика
					</h1>

					<AnalyticsFilters
						period={period}
						onPeriodChange={setPeriod}
						year={year}
						onYearChange={setYear}
						month={month}
						onMonthChange={setMonth}
						years={years}
					/>
				</div>

				{summaryLoading ? (
					<AnalyticsSummarySkeleton />
				) : (
					<AnalyticsSummary summary={summary} currency={currency} />
				)}

				{loading ? (
					period === 'Месяц' ? (
						<DailyExpenseBarChartSkeleton />
					) : (
						<IncomeExpenseLineChartSkeleton />
					)
				) : period === 'Месяц' ? (
					<DailyExpenseBarChart
						dataPoints={lineData}
						difference={summary.difference}
						currency={currency}
						year={year}
						month={month}
					/>
				) : (
					<IncomeExpenseLineChart
						title='Доходы и расходы'
						dataPoints={lineData}
						difference={summary.difference}
						currency={currency}
						year={year}
					/>
				)}

				<div className='grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7.5'>
					{loading ? (
						<>
							<CategoryDoughnutChartSkeleton />
							<CategoryDoughnutChartSkeleton />
						</>
					) : (
						<>
							<CategoryDoughnutChart title='Доходы' categories={incomes} />
							<CategoryDoughnutChart title='Расходы' categories={expenses} />
						</>
					)}
				</div>
			</div>
		</>
	);
};
