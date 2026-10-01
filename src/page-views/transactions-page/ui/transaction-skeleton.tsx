'use client';

import React from 'react';

interface TransactionSkeletonProps {
	count?: number;
}

export const TransactionSkeleton: React.FC<TransactionSkeletonProps> = ({
	count = 5,
}) => {
	return (
		<div className='flex flex-col gap-2.5'>
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={index}
					className='flex flex-col gap-2.5 rounded-[16px] bg-[var(--card)] p-2.5'
				>
					<div className='flex flex-row items-center gap-2.5'>
						<div className='skeleton-shimmer h-10 w-10 shrink-0 rounded-[10px]' />
						<div className='flex flex-1 flex-col gap-1'>
							<div className='skeleton-shimmer h-4 w-3/4 rounded-[6px]' />
							<div className='skeleton-shimmer h-3 w-1/2 rounded-[6px]' />
						</div>
						<div className='skeleton-shimmer h-6 w-20 shrink-0 rounded-[6px]' />
					</div>
				</div>
			))}
		</div>
	);
};
