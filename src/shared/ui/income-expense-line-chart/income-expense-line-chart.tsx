'use client';

import React, { memo, useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import {
	Chart as ChartJS,
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { chartColors, formatAmount, niceStep, shortMonth } from './lib';
import { renderExternalTooltip } from './render-external-tooltip';
import type {
	IncomeExpenseLineChartProps,
	LineChartTooltipDetails,
} from './types';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip);

const IncomeExpenseLineChartComponent: React.FC<
	IncomeExpenseLineChartProps
> = ({ title, dataPoints, difference, currency, year }) => {
	const { resolvedTheme } = useTheme();
	const colors = useMemo(
		() => chartColors(resolvedTheme === 'light'),
		[resolvedTheme],
	);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const tooltipDetails = useRef<LineChartTooltipDetails>({
		dataPoints: [],
		accumulated: [],
		currency,
		year,
		yearExpense: 0,
	});

	const cardClassName =
		'flex w-full flex-col gap-4 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4 pt-3 sm:p-7.5 sm:pt-5';

	if (!dataPoints || dataPoints.length === 0) {
		return (
			<div className={cardClassName}>
				<h2 className='mr-auto text-[16px] font-medium text-[var(--foreground-primary)]'>
					{title}
				</h2>
				<div className='flex min-h-[200px] w-full items-center justify-center text-[13px] text-[var(--foreground-secondary)]'>
					Недостаточно данных
				</div>
			</div>
		);
	}

	let running = 0;
	const accumulated = dataPoints.map(point => {
		running += point.income - point.expense;
		return running;
	});
	const values = dataPoints.flatMap(point => [point.income, point.expense]);
	const rawMax = Math.max(...values, ...accumulated, 0);
	const rawMin = Math.min(...values, ...accumulated, 0);
	const step = niceStep(rawMax - rawMin);
	const max = Math.max(Math.ceil(rawMax / step) * step, step);
	const min = rawMin < 0 ? Math.floor(rawMin / step) * step : 0;

	const yearExpense = dataPoints.reduce((sum, point) => sum + point.expense, 0);
	tooltipDetails.current = {
		dataPoints,
		accumulated,
		currency,
		year,
		yearExpense,
	};

	const data = {
		labels: dataPoints.map(point => shortMonth(point.label)),
		datasets: [
			{
				label: 'Доходы',
				data: dataPoints.map(point => point.income),
				borderColor: colors.income,
				backgroundColor: colors.income,
				borderWidth: 2,
				tension: 0.35,
				pointRadius: 0,
				pointHoverRadius: 4,
				pointHoverBackgroundColor: colors.income,
			},
			{
				label: 'Расходы',
				data: dataPoints.map(point => point.expense),
				borderColor: colors.expense,
				backgroundColor: colors.expense,
				borderWidth: 2,
				tension: 0.35,
				pointRadius: 0,
				pointHoverRadius: 4,
				pointHoverBackgroundColor: colors.expense,
			},
			{
				label: 'Накоплено',
				data: accumulated,
				borderColor: colors.accumulated,
				backgroundColor: colors.accumulated,
				borderWidth: 2,
				borderDash: [6, 5],
				tension: 0.35,
				pointRadius: 0,
				pointHoverRadius: 4,
				pointHoverBackgroundColor: colors.accumulated,
			},
		],
	};

	const options: ChartOptions<'line'> = {
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
					autoSkipPadding: 16,
					maxRotation: 0,
					minRotation: 0,
					padding: 8,
					font: { family: 'Manrope, sans-serif', size: 12 },
				},
				grid: {
					display: false,
				},
				border: {
					display: false,
				},
			},
			y: {
				min,
				max,
				ticks: {
					color: colors.tick,
					stepSize: step,
					font: { family: 'Manrope, sans-serif', size: 12 },
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

	const legend = [
		{ label: 'Доходы', color: colors.income },
		{ label: 'Расходы', color: colors.expense },
		{ label: 'Накоплено', color: colors.accumulated },
	];

	return (
		<div className={cardClassName}>
			<div className='flex w-full items-center justify-between gap-3'>
				<h2 className='text-[16px] font-medium text-[var(--foreground-primary)]'>
					{title}
				</h2>
				<p className='shrink-0 text-[13px] tabular-nums text-[var(--foreground-secondary)]'>
					Разница {formatAmount(difference, currency, true)}
				</p>
			</div>

			<div className='relative h-[280px] w-full'>
				<Line data={data} options={options} />
				<div
					ref={tooltipRef}
					className='pointer-events-none absolute z-10 w-max max-w-[240px] rounded-[10px] bg-[var(--button-tertiary)] px-3 py-2.5 text-[12px] leading-[1.35] text-[var(--foreground-primary)] opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.28)]'
				/>
			</div>

			<div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[var(--foreground-secondary)]'>
				{legend.map(item => (
					<span key={item.label} className='flex items-center gap-2'>
						<span
							className='size-2.5 rounded-full'
							style={{ backgroundColor: item.color }}
						/>
						{item.label}
					</span>
				))}
			</div>
		</div>
	);
};

IncomeExpenseLineChartComponent.displayName = 'IncomeExpenseLineChart';

export const IncomeExpenseLineChart: React.FC<IncomeExpenseLineChartProps> =
	memo(
		IncomeExpenseLineChartComponent,
		(prev, next) => JSON.stringify(prev) === JSON.stringify(next),
	);
