import React from 'react';

export const SettingsBlockSkeleton: React.FC = () => {
	return (
		<div className='flex flex-col gap-4 sm:gap-5 w-full p-5 bg-[var(--card)] border-[0.5px] border-[var(--border-primary)] rounded-[16px] animate-pulse'>
			<div className='h-[24px] w-1/3 bg-[var(--muted)] rounded-[8px]' />

			<div className='flex flex-col gap-3 mt-2'>
				<div className='h-[32px] w-full bg-[var(--muted)] rounded-[8px]' />
				<div className='h-[32px] w-full bg-[var(--muted)] rounded-[8px]' />
				<div className='h-[32px] w-full bg-[var(--muted)] rounded-[8px]' />
			</div>
		</div>
	);
};
