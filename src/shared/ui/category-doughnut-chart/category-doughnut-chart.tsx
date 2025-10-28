import React, { memo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	TooltipItem,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type Category = {
	id: string;
	name: string;
	amount: number;
	color: string;
};

type CategoryDoughnutChartProps = {
	title: string;
	categories: Category[] | null;
};

const CategoryDoughnutChartComponent: React.FC<CategoryDoughnutChartProps> = ({
	title,
	categories,
}) => {
	if (!categories || categories.length === 0) {
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

	const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);
	const total = sortedCategories.reduce((acc, cat) => acc + cat.amount, 0);

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

	const options = {
		plugins: {
			legend: { display: false },
			tooltip: {
				callbacks: {
					label: function (tooltipItem: TooltipItem<'doughnut'>) {
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
		responsive: true,
		maintainAspectRatio: true,
	};

	return (
		<div className='flex flex-col items-center gap-5 w-full bg-[var(--card)] rounded-[8px] pt-3 sm:p-7.5 p-4 sm:pt-5'>
			<h2 className='font-bold text-[17px] text-[var(--foreground-primary)] mr-auto'>
				{title}
			</h2>

			<div className='max-w-[400px] w-full aspect-square relative'>
				<Doughnut data={data} options={options} />
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
							<p>
								<span className='text-[var(--foreground-secondary)]'>
									{((cat.amount / total) * 100).toFixed(0)}% /
								</span>{' '}
								{cat.amount.toLocaleString('ru-RU', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}{' '}
								₽
							</p>
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
	}
);
