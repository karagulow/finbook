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
					className='flex flex-col gap-2.5 p-2.5 rounded-[16px] bg-[var(--muted)] animate-pulse'
				>
					<div className='flex flex-row items-center gap-2.5'>
						<div className='h-10 w-10 bg-[var(--border-primary)] rounded-[10px] flex-shrink-0'></div>
						<div className='flex flex-col gap-1 flex-1'>
							<div className='h-4 w-3/4 bg-[var(--border-primary)] rounded-[6px]'></div>
							<div className='h-3 w-1/2 bg-[var(--border-primary)] rounded-[6px]'></div>
						</div>
						<div className='h-6 w-20 bg-[var(--border-primary)] rounded-[6px] flex-shrink-0'></div>
					</div>
				</div>
			))}
		</div>
	);
};
