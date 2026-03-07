'use client';

import React from 'react';

import {
	CategoryDoughnutChart,
	CategoryDoughnutChartSkeleton,
	IncomeExpenseLineChart,
	IncomeExpenseLineChartSkeleton,
	Select,
	StickyHeader,
} from '@/src/shared/ui';
import { AccountOverview } from '@/src/widgets/account-overview';
import { useYearlyTransactions } from '../hooks/use-transactions';
import { useIncomeExpenseLineData } from '../hooks/use-income-expense-line-data';
import { useTransactionsByCategoryYearly } from '../hooks/use-transactions-by-category';

export const AnalyticsPage: React.FC = () => {
	const { transactions, loading } = useYearlyTransactions();
	const lineData = useIncomeExpenseLineData(transactions ?? []);
	const { incomes, expenses } = useTransactionsByCategoryYearly(
		transactions ?? [],
	);

	return (
		<>
			<StickyHeader title='Аналитика' />

			<div className='flex flex-col gap-5 sm:gap-[30px]'>
				<div className='flex flex-col items-start gap-2.5 sm:flex-row sm:justify-between sm:items-center'>
					<h1 className='font-medium text-[24px] text-[var(--foreground-primary)]'>
						Аналитика
					</h1>
				</div>

				<AccountOverview />

				{/* <Select
					options={[
						{ value: '2026', label: '2026 год' },
						{ value: '2025', label: '2025 год' },
						{ value: '2024', label: '2024 год' },
					]}
					value={'2026'}
					onChange={() => {}}
					className='w-30'
					fieldClassName='h-8'
				/> */}

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
