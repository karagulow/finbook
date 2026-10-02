import React from 'react';

export const GoalOverviewItemSkeleton: React.FC = () => {
	return (
		<div className='flex w-full items-center gap-4 rounded-[12px] sm:px-2.5 sm:py-2'>
			<div className='skeleton-shimmer size-16 shrink-0 rounded-full' />

			<div className='flex min-w-0 flex-1 flex-col gap-0.5'>
				<div className='flex h-[1.5em] items-center justify-between gap-3 text-[15px]'>
					<div className='skeleton-shimmer h-[15px] w-2/5 rounded-[8px]' />
					<div className='skeleton-shimmer h-[15px] w-8 shrink-0 rounded-[8px]' />
				</div>
				<div className='flex h-[1.5em] items-center text-[13px]'>
					<div className='skeleton-shimmer h-[13px] w-1/3 rounded-[8px]' />
				</div>
				<div className='flex h-[1.5em] items-center text-[13px]'>
					<div className='skeleton-shimmer h-[13px] w-1/2 rounded-[8px]' />
				</div>
			</div>
		</div>
	);
};
