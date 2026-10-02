import React from 'react';

export const CategoryItemSkeleton: React.FC = () => {
	return (
		<li className='flex w-full flex-col items-start gap-2.5 rounded-[14px] border-[0.5px] border-[var(--border-primary)] bg-[var(--muted)] p-2.5'>
			<div className='flex w-full flex-row items-center justify-between gap-2.5'>
				<div className='flex flex-row items-center gap-2.5'>
					<div className='skeleton-shimmer size-10 shrink-0 rounded-[10px]' />

					<div className='flex flex-col gap-1'>
						<div className='skeleton-shimmer h-[15px] w-[80px] rounded-[8px]' />
						<div className='skeleton-shimmer h-[13px] w-[100px] rounded-[8px]' />
					</div>
				</div>

				<div className='flex flex-row items-center gap-2.5'>
					<div className='skeleton-shimmer size-6 rounded-[8px]' />
					<div className='skeleton-shimmer size-6 rounded-[8px]' />
				</div>
			</div>

			<div className='mt-1 flex w-full flex-row items-center gap-1.5 overflow-hidden'>
				<div className='skeleton-shimmer h-[20px] w-[45px] rounded-[8px]' />
				<div className='skeleton-shimmer h-[20px] w-[60px] rounded-[8px]' />
				<div className='skeleton-shimmer h-[20px] w-[40px] rounded-[8px]' />
			</div>
		</li>
	);
};
