'use client';

import React, { useMemo } from 'react';
import {
	MONTH_LABELS,
	buildCategoryMonthTable,
	type CategoryMonthRow,
} from '../lib/build-category-month-table';
import type { AnalyticsTransaction } from '../model/types';

type CategoryMonthTableProps = {
	transactions: AnalyticsTransaction[];
	year: number;
	currency: string;
};

type Tone = 'income' | 'expense';

const formatAmount = (value: number) =>
	Math.round(value).toLocaleString('ru-RU');

const cardClassName =
	'flex w-full flex-col gap-4 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4 pt-3 sm:p-7.5 sm:pt-5';

const rowBorderClassName = 'border-b border-[var(--border-primary)]';
const stickyCellClassName =
	'sticky left-0 z-10 bg-[var(--card)] pl-4 pr-4 shadow-[1px_0_0_var(--border-primary)] sm:pl-7.5';
const edgePaddingClassName = 'pr-4 sm:pr-7.5';

const amountClassName = (value: number, tone?: Tone) => {
	if (tone === 'income') {
		return 'font-medium text-[var(--success)]';
	}
	if (tone === 'expense') {
		return 'font-medium text-[var(--wrong)]';
	}

	return value === 0
		? 'text-[var(--foreground-secondary)]'
		: 'text-[var(--foreground-primary)]';
};

const AmountCells: React.FC<{
	months: number[];
	total: number;
	tone?: Tone;
}> = ({ months, total, tone }) => (
	<>
		{months.map((value, index) => (
			<td
				key={MONTH_LABELS[index]}
				className={`${rowBorderClassName} h-9 min-w-[76px] pl-3 text-right text-[13px] tabular-nums ${amountClassName(value, tone)}`}
			>
				{formatAmount(value)}
			</td>
		))}
		<td
			className={`${rowBorderClassName} ${edgePaddingClassName} h-9 min-w-[96px] pl-3 text-right text-[13px] tabular-nums ${amountClassName(total, tone)}`}
		>
			{formatAmount(total)}
		</td>
	</>
);

const CategoryRow: React.FC<{ row: CategoryMonthRow }> = ({ row }) => (
	<tr>
		<th
			scope='row'
			className={`${stickyCellClassName} ${rowBorderClassName} h-9 text-left font-normal`}
		>
			<span className='flex w-[148px] items-center gap-2.5 sm:w-[164px]'>
				<span
					className='size-2 shrink-0 rounded-full'
					style={{ backgroundColor: row.color }}
				/>
				<span className='truncate text-[13px] text-[var(--foreground-primary)]'>
					{row.name}
				</span>
			</span>
		</th>
		<AmountCells months={row.months} total={row.total} />
	</tr>
);

const Section: React.FC<{
	title: string;
	rows: CategoryMonthRow[];
	totalLabel: string;
	months: number[];
	total: number;
	tone: Tone;
	spaced?: boolean;
}> = ({ title, rows, totalLabel, months, total, tone, spaced = false }) => {
	const labelTone =
		tone === 'income' ? 'text-[var(--success)]' : 'text-[var(--wrong)]';
	const spacerClassName = spaced ? 'h-10' : 'h-8';

	return (
		<>
			<tr>
				<th
					scope='colgroup'
					className={`${stickyCellClassName} ${spacerClassName} text-left align-bottom text-[14px] font-semibold text-[var(--foreground-primary)]`}
				>
					{title}
				</th>
				<td colSpan={13} className={spacerClassName} />
			</tr>
			{rows.map(row => (
				<CategoryRow key={row.id} row={row} />
			))}
			<tr>
				<th
					scope='row'
					className={`${stickyCellClassName} ${rowBorderClassName} h-9 text-left text-[13px] font-medium ${labelTone}`}
				>
					{totalLabel}
				</th>
				<AmountCells months={months} total={total} tone={tone} />
			</tr>
		</>
	);
};

export const CategoryMonthTable: React.FC<CategoryMonthTableProps> = ({
	transactions,
	year,
	currency,
}) => {
	const table = useMemo(
		() => buildCategoryMonthTable(transactions, year),
		[transactions, year],
	);
	const hasData = table.incomes.length > 0 || table.expenses.length > 0;

	return (
		<section className={cardClassName} aria-labelledby='category-month-table-title'>
			<div className='flex items-baseline justify-between gap-4'>
				<h2
					id='category-month-table-title'
					className='text-[16px] font-medium text-[var(--foreground-primary)]'
				>
					По категориям и месяцам
				</h2>
				<p className='shrink-0 text-[13px] text-[var(--foreground-secondary)]'>
					Суммы в {currency}
				</p>
			</div>

			{hasData ? (
				<div className='-mx-4 overflow-x-auto pb-1 sm:-mx-7.5'>
					<table className='w-full min-w-[1180px] border-separate border-spacing-0'>
						<thead>
							<tr>
								<th
									scope='col'
									className={`${stickyCellClassName} ${rowBorderClassName} h-8 pb-2.5 text-left align-bottom text-[12px] font-normal text-[var(--foreground-secondary)]`}
								>
									Категория
								</th>
								{MONTH_LABELS.map(label => (
									<th
										key={label}
										scope='col'
										className={`${rowBorderClassName} h-8 min-w-[76px] pb-2.5 pl-3 text-right align-bottom text-[12px] font-normal text-[var(--foreground-secondary)]`}
									>
										{label}
									</th>
								))}
								<th
									scope='col'
									className={`${rowBorderClassName} ${edgePaddingClassName} h-8 min-w-[96px] pb-2.5 pl-3 text-right align-bottom text-[12px] font-normal text-[var(--foreground-secondary)]`}
								>
									Итого
								</th>
							</tr>
						</thead>
						<tbody>
							<Section
								title='Доходы'
								rows={table.incomes}
								totalLabel='Всего доходов'
								months={table.incomeMonths}
								total={table.incomeTotal}
								tone='income'
							/>
							<Section
								title='Расходы'
								rows={table.expenses}
								totalLabel='Всего расходов'
								months={table.expenseMonths}
								total={table.expenseTotal}
								tone='expense'
								spaced
							/>
						</tbody>
					</table>
				</div>
			) : (
				<div className='flex min-h-[200px] w-full items-center justify-center text-[13px] text-[var(--foreground-secondary)]'>
					Недостаточно данных
				</div>
			)}
		</section>
	);
};
