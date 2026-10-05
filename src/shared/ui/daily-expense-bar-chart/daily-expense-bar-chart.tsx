'use client';

import React, { memo, useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	type Chart,
	type ChartOptions,
	type TooltipModel,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

type DailyExpenseCategory = {
	name: string;
	amount: number;
};

type DailyExpensePoint = {
	label: string;
	expense: number;
	categories?: DailyExpenseCategory[];
};

type DailyExpenseBarChartProps = {
	dataPoints: DailyExpensePoint[] | null;
	difference: number;
	currency: string;
	year: number;
	month: number;
};

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

const VISIBLE_CATEGORIES = 4;

const formatAmount = (value: number, currency: string, signed = false) => {
	const rounded = Math.round(value);
	const formatted = Math.abs(rounded).toLocaleString('ru-RU');
	const sign = signed ? (rounded > 0 ? '+' : rounded < 0 ? '-' : '') : '';

	return `${sign}${formatted} ${currency}`;
};

const niceScale = (value: number) => {
	if (value <= 0) return { max: 1000, step: 200 };

	const roughStep = value / 7;
	const magnitude = 10 ** Math.floor(Math.log10(roughStep));
	const residual = roughStep / magnitude;
	const niceFactor =
		residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10;
	const step = niceFactor * magnitude;

	return { max: Math.ceil(value / step) * step, step };
};

const renderExternalTooltip = (
	el: HTMLDivElement,
	context: { chart: Chart; tooltip: TooltipModel<'bar'> },
	details: {
		dataPoints: DailyExpensePoint[];
		currency: string;
		year: number;
		month: number;
		monthExpense: number;
	},
) => {
	const { tooltip, chart } = context;

	if (tooltip.opacity === 0 || !tooltip.dataPoints.length) {
		el.style.opacity = '0';
		return;
	}

	const point = details.dataPoints[tooltip.dataPoints[0].dataIndex];
	if (!point) {
		el.style.opacity = '0';
		return;
	}

	el.replaceChildren();

	const title = document.createElement('div');
	title.className = 'font-medium text-[13px]';
	title.textContent = `${point.label} ${MONTHS_GENITIVE[details.month]} ${details.year}`;
	el.append(title);

	const expense = document.createElement('div');
	expense.className = 'mt-1.5 text-[var(--wrong)]';
	expense.textContent =
		point.expense <= 0
			? 'Расходов не было'
			: `Расходы: ${formatAmount(point.expense, details.currency)}`;
	el.append(expense);

	if (point.expense > 0) {
		const share =
			details.monthExpense > 0
				? Math.round((point.expense / details.monthExpense) * 100)
				: 0;
		const shareLine = document.createElement('div');
		shareLine.className = 'mt-0.5 text-[var(--foreground-secondary)]';
		shareLine.textContent = `${share}% от расходов за месяц`;
		el.append(shareLine);

		const categories = point.categories ?? [];
		if (categories.length > 0) {
			const list = document.createElement('div');
			list.className =
				'mt-2 flex flex-col gap-0.5 border-t border-[var(--border-primary)] pt-2';

			const visible = categories.slice(0, VISIBLE_CATEGORIES);
			for (const category of visible) {
				const row = document.createElement('div');
				row.textContent = `${category.name}: ${formatAmount(category.amount, details.currency)}`;
				list.append(row);
			}

			const hidden = categories.slice(VISIBLE_CATEGORIES);
			if (hidden.length > 0) {
				const hiddenAmount = hidden.reduce(
					(sum, category) => sum + category.amount,
					0,
				);
				const row = document.createElement('div');
				row.className = 'text-[var(--foreground-secondary)]';
				row.textContent = `Ещё ${hidden.length}: ${formatAmount(hiddenAmount, details.currency)}`;
				list.append(row);
			}

			el.append(list);
		}
	}

	const canvas = chart.canvas;
	const openToLeft = tooltip.caretX > canvas.clientWidth * 0.62;
	el.style.opacity = '1';
	el.style.left = `${tooltip.caretX}px`;
	el.style.top = `${tooltip.caretY}px`;
	el.style.transform = openToLeft
		? 'translate(calc(-100% - 14px), 0)'
		: 'translate(14px, 0)';
};

const chartColors = (isLight: boolean) => {
	const fallback = isLight
		? { tick: '#6f6f6f', grid: '#dddddd', bar: '#ff4d4f' }
		: { tick: '#969799', grid: '#2c2e33', bar: '#ff8583' };

	if (typeof document === 'undefined') return fallback;

	const styles = getComputedStyle(document.documentElement);
	const tick = styles.getPropertyValue('--foreground-secondary').trim();
	const grid = styles.getPropertyValue('--border-primary').trim();
	const bar = styles.getPropertyValue('--wrong').trim();

	return {
		tick: tick || fallback.tick,
		grid: grid || fallback.grid,
		bar: bar || fallback.bar,
	};
};

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
	const tooltipDetails = useRef({
		dataPoints,
		currency,
		year,
		month,
		monthExpense,
	});
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
					className='pointer-events-none absolute z-10 w-max max-w-[240px] rounded-[10px] bg-[var(--button-tertiary)] px-3 py-2.5 text-[12px] leading-[1.35] text-[var(--foreground-primary)] opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.28)]'
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
