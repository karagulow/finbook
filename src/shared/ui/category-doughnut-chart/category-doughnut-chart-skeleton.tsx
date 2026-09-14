'use client';

import React from 'react';

export const CategoryDoughnutChartSkeleton: React.FC = () => {
	return (
		<div className='flex flex-col gap-5 w-full bg-[var(--card)] border-[0.5px] border-[var(--border-primary)] rounded-[16px] pt-3 sm:p-7.5 p-4 sm:pt-5 animate-pulse'>
			<div className='self-center aspect-square w-4/5 bg-[var(--foreground-secondary)] rounded-full'></div>

			<ul className='flex flex-col gap-3 w-full'>
				{Array.from({ length: 5 }).map((_, idx) => (
					<li key={idx} className='flex justify-between items-center w-full'>
						<div className='flex items-center gap-2.5'>
							<div className='size-2.5 rounded-full bg-[var(--foreground-secondary)]'></div>
							<div className='h-[14px] w-24 bg-[var(--foreground-secondary)] rounded'></div>
						</div>
						<div className='h-[14px] w-16 bg-[var(--foreground-secondary)] rounded'></div>
					</li>
				))}
			</ul>
		</div>
	);
};
