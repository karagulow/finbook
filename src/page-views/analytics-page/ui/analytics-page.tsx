'use client';

import React, { useEffect, useMemo, useState } from 'react';

import {
	CategoryDoughnutChart,
	CategoryDoughnutChartSkeleton,
	IncomeExpenseLineChart,
	IncomeExpenseLineChartSkeleton,
	StickyHeader,
} from '@/src/shared/ui';
import { useAnalyticsYears } from '../hooks/use-analytics-years';
import { useYearlyTransactions } from '../hooks/use-transactions';
import { useIncomeExpenseLineData } from '../hooks/use-income-expense-line-data';
import { useTransactionsByCategoryYearly } from '../hooks/use-transactions-by-category';
import { AnalyticsFilters, type AnalyticsPeriod } from './analytics-filters';

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
	const linePeriod = period === 'Месяц' ? 'month' : 'year';
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

				{loading ? (
					<IncomeExpenseLineChartSkeleton />
				) : (
					<IncomeExpenseLineChart
						title='Доходы и расходы'
						dataPoints={lineData}
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
