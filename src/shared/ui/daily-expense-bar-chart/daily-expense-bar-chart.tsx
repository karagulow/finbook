'use client';

import React, { memo, useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { chartColors, formatAmount, niceScale } from './lib';
import { renderExternalTooltip } from './render-external-tooltip';
import type {
	DailyExpenseBarChartProps,
	DailyExpenseTooltipDetails,
} from './types';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const DailyExpenseBarChartComponent: React.FC<DailyExpenseBarChartProps> = ({
	dataPoints,
	difference,
	currency,
	year,
	month,
}) => {
	const { resolvedTheme } = useTheme();
	const colors = useMemo(
		() => chartColors(resolvedTheme === 'light'),
		[resolvedTheme],
	);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const tooltipDetails = useRef<DailyExpenseTooltipDetails>({
		dataPoints: [],
		currency,
		year,
		month,
		monthExpense: 0,
	});

	const cardClassName =
		'flex w-full flex-col gap-4 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4 pt-3 sm:p-7.5 sm:pt-5';

	if (!dataPoints || dataPoints.length === 0) {
		return (
			<div className={cardClassName}>
				<h2 className='mr-auto text-[16px] font-medium text-[var(--foreground-primary)]'>
					Расходы по дням
				</h2>
				<div className='flex min-h-[200px] w-full items-center justify-center text-[13px] text-[var(--foreground-secondary)]'>
					Недостаточно данных
				</div>
			</div>
		);
	}

	const maxExpense = Math.max(...dataPoints.map(point => point.expense), 0);
	const scale = niceScale(maxExpense);
	const monthExpense = dataPoints.reduce((sum, point) => sum + point.expense, 0);
	tooltipDetails.current = {
		dataPoints,
		currency,
		year,
		month,
		monthExpense,
	};

	const data = {
		labels: dataPoints.map(point => point.label),
		datasets: [
			{
				label: 'Расходы',
				data: dataPoints.map(point => point.expense),
				backgroundColor: colors.bar,
				borderRadius: 3,
				borderSkipped: 'bottom' as const,
				maxBarThickness: 18,
				categoryPercentage: 0.8,
				barPercentage: 0.9,
			},
		],
	};

	const options: ChartOptions<'bar'> = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			mode: 'index',
			intersect: false,
		},
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				enabled: false,
				external: context => {
					if (!tooltipRef.current) return;
					renderExternalTooltip(
						tooltipRef.current,
						context,
						tooltipDetails.current,
					);
				},
			},
		},
		scales: {
			x: {
				ticks: {
					color: colors.tick,
					autoSkip: true,
					maxRotation: 0,
					font: { size: 11 },
				},
				grid: {
					display: false,
				},
				border: {
					display: false,
				},
			},
			y: {
				beginAtZero: true,
				max: scale.max,
				ticks: {
					color: colors.tick,
					stepSize: scale.step,
					font: { size: 11 },
					callback: (tickValue: string | number) => {
						const parsed =
							typeof tickValue === 'number' ? tickValue : Number(tickValue);
						if (Number.isNaN(parsed)) return tickValue;
						return `${Math.round(parsed).toLocaleString('ru-RU')} ${currency}`;
					},
				},
				grid: {
					color: colors.grid,
				},
				border: {
					display: false,
				},
			},
		},
	};

	return (
		<div className={cardClassName}>
			<div className='flex w-full items-center justify-between gap-3'>
				<h2 className='text-[16px] font-medium text-[var(--foreground-primary)]'>
					Расходы по дням
				</h2>
				<p className='shrink-0 text-[13px] text-[var(--foreground-secondary)] tabular-nums'>
					Разница {formatAmount(difference, currency, true)}
				</p>
			</div>

			<div className='relative h-[280px] w-full'>
				<Bar data={data} options={options} />
				<div
					ref={tooltipRef}
					className='pointer-events-none absolute z-[1] w-max max-w-[240px] rounded-[10px] bg-[var(--button-tertiary)] px-3 py-2.5 text-[12px] leading-[1.35] text-[var(--foreground-primary)] opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.28)]'
				/>
			</div>

			<div className='flex items-center gap-2 text-[13px] text-[var(--foreground-secondary)]'>
				<span
					className='size-2.5 rounded-full'
					style={{ backgroundColor: colors.bar }}
				/>
				Расходы
			</div>
		</div>
	);
};

DailyExpenseBarChartComponent.displayName = 'DailyExpenseBarChart';

export const DailyExpenseBarChart: React.FC<DailyExpenseBarChartProps> = memo(
	DailyExpenseBarChartComponent,
	(prev, next) => JSON.stringify(prev) === JSON.stringify(next),
);
