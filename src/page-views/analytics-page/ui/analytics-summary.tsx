'use client';

import React from 'react';
import { useAnimatedNumber } from '@/src/shared/hooks';
import type { AnalyticsSummary as AnalyticsSummaryData } from '../lib/get-analytics-summary';

type Metric = 'income' | 'expense' | 'difference';

type AnalyticsSummaryProps = {
	summary: AnalyticsSummaryData;
	currency: string;
};

const formatAmount = (value: number, currency: string, signed = false) => {
	const rounded = Math.round(value);
	const formatted = Math.abs(rounded).toLocaleString('ru-RU');
	const sign = signed
		? rounded > 0
			? '+'
			: rounded < 0
				? '-'
				: ''
		: rounded < 0
			? '-'
			: '';

	return `${sign}${formatted} ${currency}`;
};

const formatChange = (value: number, compareLabel: string) => {
	const rounded = Math.round(value);
	const sign = rounded > 0 ? '+' : '';

	return `${sign}${rounded}% к ${compareLabel}`;
};

const changeClassName = (metric: Metric, value: number) => {
	if (Math.round(value) === 0) {
		return 'font-medium text-[var(--foreground-secondary)]';
	}

	const improved = metric === 'expense' ? value < 0 : value > 0;

	return improved
		? 'font-medium text-[var(--success)]'
		: 'font-medium text-[var(--wrong)]';
};

const SummaryAmount: React.FC<{
	value: number;
	currency: string;
	signed?: boolean;
}> = ({ value, currency, signed = false }) => {
	const animated = useAnimatedNumber(value);

	return (
		<p className='font-semibold text-[18px] leading-tight text-[var(--foreground-primary)] tabular-nums sm:text-[20px]'>
			{formatAmount(animated, currency, signed)}
		</p>
	);
};

const SummaryCard: React.FC<{
	title: string;
	amount: number;
	currency: string;
	signed?: boolean;
	caption: string;
	captionClassName: string;
}> = ({ title, amount, currency, signed, caption, captionClassName }) => {
	return (
		<div className='flex min-w-0 flex-col gap-1 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] px-4 py-3.5 sm:px-5 sm:py-4'>
			<p className='text-[13px] text-[var(--foreground-secondary)]'>{title}</p>
			<SummaryAmount value={amount} currency={currency} signed={signed} />
			<p className={`text-[13px] ${captionClassName}`}>{caption}</p>
		</div>
	);
};

export const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({
	summary,
	currency,
}) => {
	const changeCaption = (metric: Metric, change: number | null) =>
		change === null
			? {
					caption: summary.noDataCaption,
					captionClassName: 'text-[var(--foreground-secondary)]',
				}
			: {
					caption: formatChange(change, summary.compareLabel),
					captionClassName: changeClassName(metric, change),
				};

	return (
		<div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
			<SummaryCard
				title='Доходы'
				amount={summary.income}
				currency={currency}
				{...changeCaption('income', summary.incomeChange)}
			/>
			<SummaryCard
				title='Расходы'
				amount={summary.expense}
				currency={currency}
				{...changeCaption('expense', summary.expenseChange)}
			/>
			<SummaryCard
				title='Разница'
				amount={summary.difference}
				currency={currency}
				signed
				{...changeCaption('difference', summary.differenceChange)}
			/>
			<SummaryCard
				title={summary.averageTitle}
				amount={summary.averageExpense}
				currency={currency}
				caption='средний расход'
				captionClassName='text-[var(--foreground-secondary)]'
			/>
		</div>
	);
};
