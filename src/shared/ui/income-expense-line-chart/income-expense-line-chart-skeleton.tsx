'use client';

import React from 'react';

export const IncomeExpenseLineChartSkeleton = () => {
	return (
		<div className='flex flex-col items-center gap-5 w-full bg-[var(--card)] rounded-[8px] pt-3 sm:p-7.5 p-4 sm:pt-5 animate-pulse'>
			<div className='h-[14px] w-24 bg-[var(--foreground-secondary)] rounded self-start'></div>

			<div className='w-full max-w-[600px] min-h-[250px] relative flex flex-col justify-end'>
				<div className='absolute inset-0 grid grid-rows-5 grid-cols-10'>
					{Array.from({ length: 5 * 10 }).map((_, i) => (
						<div
							key={i}
							className='border-[0.5px] border-[var(--border-primary)] opacity-30'
						/>
					))}
				</div>

				<div className='relative h-full w-full'>
					<div className='absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-[var(--foreground-secondary)]/30 to-transparent rounded-t-full'></div>
					<div className='absolute bottom-0 left-0 w-full h-[25%] bg-gradient-to-t from-[var(--foreground-primary)]/30 to-transparent rounded-t-full'></div>
				</div>
			</div>

			<div className='flex justify-center gap-6 mt-2'>
				<div className='flex items-center gap-2'>
					<span className='w-3 h-3 rounded-full bg-[var(--success)]' />
					<span className='text-[13px] text-[var(--foreground-secondary)]'>
						Доходы
					</span>
				</div>
				<div className='flex items-center gap-2'>
					<span className='w-3 h-3 rounded-full bg-[var(--wrong)]' />
					<span className='text-[13px] text-[var(--foreground-secondary)]'>
						Расходы
					</span>
				</div>
			</div>
		</div>
	);
};
