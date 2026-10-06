'use client';

import React from 'react';

const yLabels = ['w-9', 'w-7', 'w-10', 'w-6', 'w-8'];
const barHeights = [
	'h-[92%]',
	'h-[14%]',
	'h-[12%]',
	'h-[24%]',
	'h-[16%]',
	'h-[15%]',
	'h-[18%]',
	'h-[11%]',
	'h-[13%]',
	'h-[15%]',
	'h-[17%]',
	'h-[14%]',
	'h-[20%]',
	'h-[13%]',
	'h-[16%]',
	'h-[12%]',
	'h-[28%]',
	'h-[14%]',
	'h-[15%]',
	'h-[13%]',
	'h-[16%]',
	'h-[10%]',
	'h-[14%]',
	'h-[11%]',
	'h-[13%]',
	'h-[12%]',
	'h-[15%]',
	'h-[16%]',
];

export const DailyExpenseBarChartSkeleton = () => {
	return (
		<div className='flex w-full flex-col gap-4 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4 pt-3 sm:p-7.5 sm:pt-5'>
			<div className='flex w-full items-center justify-between gap-3'>
				<div className='skeleton-shimmer h-[16px] w-36 rounded-[8px]' />
				<div className='skeleton-shimmer h-[13px] w-28 rounded-[8px]' />
			</div>

			<div className='flex h-[280px] w-full gap-3'>
				<div className='flex w-10 shrink-0 flex-col justify-between py-1'>
					{yLabels.map((width, index) => (
						<div
							key={index}
							className={`skeleton-shimmer h-[10px] rounded-[8px] ${width}`}
						/>
					))}
				</div>

				<div className='relative flex min-w-0 flex-1 items-end justify-between gap-1 pb-6'>
					<div className='absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between py-1'>
						{yLabels.map((_, index) => (
							<div
								key={index}
								className='border-b-[0.5px] border-[var(--border-primary)]'
							/>
						))}
					</div>
					{barHeights.map((height, index) => (
						<div
							key={index}
							className={`skeleton-shimmer relative z-[1] w-full max-w-3 rounded-t-[3px] ${height}`}
						/>
					))}
				</div>
			</div>

			<div className='flex items-center gap-2'>
				<div className='skeleton-shimmer size-2.5 rounded-full' />
				<div className='skeleton-shimmer h-[13px] w-16 rounded-[8px]' />
			</div>
		</div>
	);
};
