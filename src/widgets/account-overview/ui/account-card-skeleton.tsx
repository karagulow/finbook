import React from 'react';

export const AccountCardSkeleton: React.FC = () => {
	return (
		<div className='flex-shrink-0 w-full'>
			<div className='flex h-[100px] flex-col justify-between rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4'>
				<div className='skeleton-shimmer h-[15px] w-2/5 rounded-[8px]' />

				<div className='flex items-baseline gap-2'>
					<div className='skeleton-shimmer h-[21px] w-2/3 rounded-[8px]' />
					<div className='skeleton-shimmer h-[15px] w-8 rounded-[8px]' />
				</div>
			</div>
		</div>
	);
};
