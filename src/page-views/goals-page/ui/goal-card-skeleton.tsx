import React from 'react';

export const GoalCardSkeleton: React.FC = () => {
	return (
		<div className='flex animate-pulse items-center gap-4 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4'>
			<div className='size-14 shrink-0 rounded-full bg-[var(--button-secondary)]' />
			<div className='flex flex-col gap-1.5'>
				<div className='h-[15px] w-24 rounded-[8px] bg-[var(--button-secondary)]' />
				<div className='h-[13px] w-36 rounded-[8px] bg-[var(--button-secondary)]' />
				<div className='h-[15px] w-40 rounded-[8px] bg-[var(--button-secondary)]' />
			</div>
		</div>
	);
};
