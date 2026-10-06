'use client';

import React, { useMemo } from 'react';
import { Select, Tabs } from '@/src/shared/ui';
import { useAccounts } from '@/src/widgets/account-overview/hooks/use-accounts';
import { useSelectedAccount } from '@/src/widgets/account-overview/hooks/use-selected-account';

const PERIODS = ['Месяц', 'Год'] as const;

export type AnalyticsPeriod = (typeof PERIODS)[number];

const MONTHS = [
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

const fieldClassName =
	'h-8 rounded-full bg-[var(--muted)] px-3.5 font-medium';

type AnalyticsFiltersProps = {
	period: AnalyticsPeriod;
	onPeriodChange: (period: AnalyticsPeriod) => void;
	year: number;
	onYearChange: (year: number) => void;
	month: number;
	onMonthChange: (month: number) => void;
	years: number[];
};

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
	period,
	onPeriodChange,
	year,
	onYearChange,
	month,
	onMonthChange,
	years,
}) => {
	const { accounts } = useAccounts();
	const { selectedAccountId, setSelectedAccountId } = useSelectedAccount();

	const yearOptions = useMemo(
		() => years.map(value => ({ value, label: String(value) })),
		[years],
	);

	const monthOptions = useMemo(
		() => MONTHS.map((label, index) => ({ value: index, label })),
		[],
	);

	const accountOptions = useMemo(
		() => [
			{ value: 'all', label: 'Все счета' },
			...accounts.map(account => ({
				value: account.id,
				label: account.name,
			})),
		],
		[accounts],
	);

	return (
		<div className='flex flex-wrap items-center gap-2'>
			<Tabs
				items={[...PERIODS]}
				activeItem={period}
				setActiveItem={item => onPeriodChange(item as AnalyticsPeriod)}
				tabName='analytics-period'
				className='h-8 w-[148px] shrink-0 [&_button]:flex [&_button]:h-full [&_button]:items-center [&_button]:justify-center [&_button]:py-0'
			/>

			<Select
				options={monthOptions}
				value={month}
				onChange={onMonthChange}
				disabled={period === 'Год'}
				reserveErrorSpace={false}
				fieldClassName={fieldClassName}
				className='h-8 w-[140px] shrink-0'
			/>

			<Select
				options={yearOptions}
				value={year}
				onChange={onYearChange}
				reserveErrorSpace={false}
				fieldClassName={fieldClassName}
				className='h-8 w-[92px] shrink-0'
			/>

			<Select
				options={accountOptions}
				value={selectedAccountId ?? 'all'}
				onChange={setSelectedAccountId}
				reserveErrorSpace={false}
				fieldClassName={fieldClassName}
				className='h-8 w-[160px] shrink-0'
			/>
		</div>
	);
};
