'use client';

import React from 'react';

export const CategoryDoughnutChartSkeleton: React.FC = () => {
	return (
		<div className='flex w-full flex-col gap-5 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4 pt-3 sm:p-7.5 sm:pt-5'>
			<div className='skeleton-shimmer aspect-square w-4/5 self-center rounded-full' />

			<ul className='flex w-full flex-col gap-3'>
				{Array.from({ length: 5 }).map((_, idx) => (
					<li key={idx} className='flex w-full items-center justify-between'>
						<div className='flex items-center gap-2.5'>
							<div className='skeleton-shimmer size-2.5 rounded-full' />
							<div className='skeleton-shimmer h-[14px] w-24 rounded-[8px]' />
						</div>
						<div className='skeleton-shimmer h-[14px] w-16 rounded-[8px]' />
					</li>
				))}
			</ul>
		</div>
	);
};
