import React from 'react';

export const SettingsBlockSkeleton: React.FC = () => {
	return (
		<div className='flex w-full flex-col gap-4 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-5 sm:gap-5'>
			<div className='skeleton-shimmer h-[24px] w-1/3 rounded-[8px]' />

			<div className='mt-2 flex flex-col gap-3'>
				<div className='skeleton-shimmer h-[32px] w-full rounded-[8px]' />
				<div className='skeleton-shimmer h-[32px] w-full rounded-[8px]' />
				<div className='skeleton-shimmer h-[32px] w-full rounded-[8px]' />
			</div>
		</div>
	);
};
