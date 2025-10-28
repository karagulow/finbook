'use client';

import React, { memo } from 'react';
import {
	Chart as ChartJS,
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
	Filler,
	type TooltipItem,
	type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
	Filler
);

type LineChartPoint = {
	label: string;
	income: number;
	expense: number;
};

type IncomeExpenseLineChartProps = {
	title: string;
	dataPoints: LineChartPoint[] | null;
};

const IncomeExpenseLineChartComponent: React.FC<
	IncomeExpenseLineChartProps
> = ({ title, dataPoints }) => {
	if (!dataPoints || dataPoints.length === 0) {
		return (
			<div className='flex flex-col items-center gap-5 w-full bg-[var(--card)] rounded-[8px] pt-3 sm:p-7.5 p-4 sm:pt-5'>
				<h2 className='font-bold text-[17px] text-[var(--foreground-primary)] mr-auto'>
					{title}
				</h2>
				<div className='flex items-center justify-center w-full h-[100%] min-h-[200px] text-[var(--foreground-secondary)] text-[13px]'>
					Недостаточно данных
				</div>
			</div>
		);
	}

	console.log(dataPoints);

	const labels = dataPoints.map(p => p.label);

	const data = {
		labels,
		datasets: [
			{
				label: 'Доходы',
				data: dataPoints.map(p => p.income),
				borderColor: '#22c55e',
				backgroundColor: '#22c55e33',
				fill: true,
				tension: 0.3,
				pointRadius: 4,
				pointHoverRadius: 5,
			},
			{
				label: 'Расходы',
				data: dataPoints.map(p => p.expense),
				borderColor: '#ff4d4f',
				backgroundColor: '#ff4d4f33',
				fill: true,
				tension: 0.3,
				pointRadius: 4,
				pointHoverRadius: 5,
			},
		],
	};

	const options: ChartOptions<'line'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'bottom',
				labels: {
					color: '#6f6f6f',
					boxWidth: 12,
					boxHeight: 12,
				},
			},
			tooltip: {
				callbacks: {
					label: function (tooltipItem: TooltipItem<'line'>) {
						const value = tooltipItem.raw as number;
						return (
							value.toLocaleString('ru-RU', {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							}) + ' ₽'
						);
					},
				},
			},
		},
		scales: {
			x: {
				ticks: {
					color: '#6f6f6f',
					autoSkip: true,
				},
				grid: {
					color: '#6f6f6f',
				},
			},
			y: {
				ticks: {
					color: '#6f6f6f',
					callback: function (tickValue: string | number) {
						if (typeof tickValue === 'number') {
							return `${tickValue.toLocaleString('ru-RU')} ₽`;
						}
						const parsed = Number(tickValue);
						return isNaN(parsed)
							? tickValue
							: `${parsed.toLocaleString('ru-RU')} ₽`;
					},
				},
				grid: {
					color: '#6f6f6f',
				},
			},
		},
	};

	return (
		<div className='flex flex-col items-center gap-5 w-full bg-[var(--card)] rounded-[8px] pt-3 sm:p-7.5 p-4 sm:pt-5'>
			<h2 className='font-bold text-[17px] text-[var(--foreground-primary)] mr-auto'>
				{title}
			</h2>

			<div className='w-full h-[300px]'>
				<Line data={data} options={options} />
			</div>
		</div>
	);
};

IncomeExpenseLineChartComponent.displayName = 'IncomeExpenseLineChart';

export const IncomeExpenseLineChart: React.FC<IncomeExpenseLineChartProps> =
	memo(
		IncomeExpenseLineChartComponent,
		(prev, next) => JSON.stringify(prev) === JSON.stringify(next)
	);
