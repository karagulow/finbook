import React from 'react';

export const GoalCardSkeleton: React.FC = () => {
	return (
		<div className='flex items-center gap-4 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4'>
			<div className='skeleton-shimmer size-14 shrink-0 rounded-full' />
			<div className='flex flex-col gap-1.5'>
				<div className='skeleton-shimmer h-[15px] w-24 rounded-[8px]' />
				<div className='skeleton-shimmer h-[13px] w-36 rounded-[8px]' />
				<div className='skeleton-shimmer h-[15px] w-40 rounded-[8px]' />
			</div>
		</div>
	);
};
