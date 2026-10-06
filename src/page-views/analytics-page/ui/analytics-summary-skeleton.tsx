import React from 'react';

export const AnalyticsSummarySkeleton: React.FC = () => {
	return (
		<div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
			{Array.from({ length: 4 }, (_, index) => (
				<div
					key={index}
					className='flex h-[98px] flex-col gap-1 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] px-4 py-3.5 sm:h-[105px] sm:px-5 sm:py-4'
				>
					<div className='skeleton-shimmer h-[19px] w-16 rounded-[8px] sm:h-5' />
					<div className='skeleton-shimmer h-[23px] w-28 rounded-[8px] sm:h-6' />
					<div className='skeleton-shimmer h-[19px] w-24 rounded-[8px] sm:h-5' />
				</div>
			))}
		</div>
	);
};
