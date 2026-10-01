import React from 'react';

export const DebtCardSkeleton: React.FC = () => {
	return (
		<div className='flex flex-col gap-3 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4'>
			<div className='flex items-center justify-between gap-3'>
				<div className='flex flex-col gap-1.5'>
					<div className='skeleton-shimmer h-[15px] w-24 rounded-[8px]' />
					<div className='skeleton-shimmer h-[13px] w-36 rounded-[8px]' />
				</div>
				<div className='skeleton-shimmer h-[15px] w-28 rounded-[8px]' />
			</div>
			<div className='skeleton-shimmer h-1 w-full rounded-full' />
		</div>
	);
};
