import React from 'react';

export const CategoryMonthTableSkeleton: React.FC = () => {
	return (
		<div className='flex w-full flex-col gap-4 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4 pt-3 sm:p-7.5 sm:pt-5'>
			<div className='flex items-center justify-between gap-4'>
				<div className='skeleton-shimmer h-5 w-52 rounded-[8px]' />
				<div className='skeleton-shimmer h-4 w-20 rounded-[8px]' />
			</div>
			<div className='flex flex-col gap-3 py-2'>
				{Array.from({ length: 8 }, (_, index) => (
					<div
						key={index}
						className='skeleton-shimmer h-4 rounded-[8px]'
						style={{ width: `${92 - (index % 3) * 8}%` }}
					/>
				))}
			</div>
		</div>
	);
};
