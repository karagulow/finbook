import React from 'react';

export const CategoryItemSkeleton: React.FC = () => {
	return (
		<li className='flex flex-col gap-2.5 items-start p-2.5 w-full bg-[var(--muted)] border-[0.5px] border-[var(--border-primary)] rounded-[14px] animate-pulse'>
			<div className='flex flex-row items-center justify-between gap-2.5 w-full'>
				<div className='flex flex-row items-center gap-2.5'>
					<div className='size-10 rounded-[10px] bg-[var(--button-secondary)] flex-shrink-0' />

					<div className='flex flex-col gap-1'>
						<div className='h-[15px] w-[80px] bg-[var(--button-secondary)] rounded-[8px]' />
						<div className='h-[13px] w-[100px] bg-[var(--button-secondary)] rounded-[8px]' />
					</div>
				</div>

				<div className='flex flex-row items-center gap-2.5'>
					<div className='size-6 rounded-[8px] bg-[var(--button-secondary)]' />
					<div className='size-6 rounded-[8px] bg-[var(--button-secondary)]' />
				</div>
			</div>

			<div className='flex flex-row gap-1.5 items-center overflow-hidden w-full mt-1'>
				<div className='h-[20px] w-[45px] bg-[var(--button-secondary)] rounded-[8px]' />
				<div className='h-[20px] w-[60px] bg-[var(--button-secondary)] rounded-[8px]' />
				<div className='h-[20px] w-[40px] bg-[var(--button-secondary)] rounded-[8px]' />
			</div>
		</li>
	);
};
