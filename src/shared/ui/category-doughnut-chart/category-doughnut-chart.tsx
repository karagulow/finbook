'use client';

import React, { memo, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	type ChartOptions,
} from 'chart.js';

import { useAnimatedNumber } from '@/src/shared/hooks';
import { formatAmount } from './lib';
import { renderExternalTooltip } from './render-external-tooltip';
import type {
	CategoryDoughnutChartProps,
	CategoryDoughnutTooltipDetails,
} from './types';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryAmount: React.FC<{ amount: number; total: number }> = ({
	amount,
	total,
}) => {
	const animatedAmount = useAnimatedNumber(amount);
	const percent = total > 0 ? (animatedAmount / total) * 100 : 0;

	return (
		<p className='tabular-nums'>
			<span className='text-[var(--foreground-secondary)]'>
				{percent.toFixed(0)}% /
			</span>{' '}
			{formatAmount(animatedAmount)} ₽
		</p>
	);
};

const ChartTotal: React.FC<{ total: number }> = ({ total }) => {
	const animatedTotal = useAnimatedNumber(total);

	return (
		<span className='font-bold text-[18px] text-[var(--foreground-primary)] tabular-nums'>
			{formatAmount(animatedTotal)} ₽
		</span>
	);
};

const CategoryDoughnutChartComponent: React.FC<CategoryDoughnutChartProps> = ({
	title,
	categories,
}) => {
	const tooltipRef = useRef<HTMLDivElement>(null);
	const tooltipDetails = useRef<CategoryDoughnutTooltipDetails>({
		title,
		categories: [],
		total: 0,
	});

	if (!categories || categories.length === 0) {
		return (
			<div className='flex flex-col items-center gap-5 w-full bg-[var(--card)] border-[0.5px] border-[var(--border-primary)] rounded-[16px] pt-3 sm:p-7.5 p-4 sm:pt-5'>
				<h2 className='font-bold text-[17px] text-[var(--foreground-primary)] mr-auto'>
					{title}
				</h2>
				<div className='flex items-center justify-center w-full h-[100%] min-h-[200px] text-[var(--foreground-secondary)] text-[13px]'>
					Недостаточно данных
				</div>
			</div>
		);
	}

	const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);
	const total = sortedCategories.reduce((acc, cat) => acc + cat.amount, 0);
	tooltipDetails.current = { title, categories: sortedCategories, total };

	const data = {
		labels: sortedCategories.map(cat => cat.name),
		datasets: [
			{
				data: sortedCategories.map(cat => cat.amount),
				backgroundColor: sortedCategories.map(cat => cat.color),
				borderWidth: 0,
			},
		],
	};

	const options: ChartOptions<'doughnut'> = {
		cutout: '65%',
		interaction: {
			mode: 'nearest',
			intersect: true,
		},
		plugins: {
			legend: { display: false },
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
		responsive: true,
		maintainAspectRatio: true,
	};

	return (
		<div className='flex flex-col items-center gap-5 w-full bg-[var(--card)] border-[0.5px] border-[var(--border-primary)] rounded-[16px] pt-3 sm:p-7.5 p-4 sm:pt-5'>
			<h2 className='font-bold text-[17px] text-[var(--foreground-primary)] mr-auto'>
				{title}
			</h2>

			<div className='max-w-[400px] w-full aspect-square relative'>
				<Doughnut data={data} options={options} />

				<div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
					<span className='text-[13px] text-[var(--foreground-secondary)]'>
						Всего
					</span>
					<ChartTotal total={total} />
				</div>
				<div
					ref={tooltipRef}
					className='pointer-events-none absolute z-[1] w-max max-w-[240px] rounded-[10px] bg-[var(--button-tertiary)] px-3 py-2.5 text-[12px] leading-[1.35] text-[var(--foreground-primary)] opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.28)]'
				/>
			</div>

			<ul className='flex flex-col gap-2 w-full'>
				{sortedCategories.map((cat, index) => (
					<li key={cat.id} className='flex flex-col gap-2'>
						<div className='flex justify-between items-center w-full font-medium text-[13px] text-[var(--foreground-primary)]'>
							<div className='flex items-center gap-2.5'>
								<span
									className='size-2.5 rounded-full'
									style={{ backgroundColor: cat.color }}
								></span>
								<span>{cat.name}</span>
							</div>
							<CategoryAmount amount={cat.amount} total={total} />
						</div>
						{index < sortedCategories.length - 1 && (
							<hr className='border-[var(--border-primary)] h-[1px] w-full' />
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

CategoryDoughnutChartComponent.displayName = 'CategoryDoughnutChart';

export const CategoryDoughnutChart: React.FC<CategoryDoughnutChartProps> = memo(
	CategoryDoughnutChartComponent,
	(prev, next) => {
		return (
			prev.title === next.title &&
			JSON.stringify(prev.categories) === JSON.stringify(next.categories)
		);
	},
);
