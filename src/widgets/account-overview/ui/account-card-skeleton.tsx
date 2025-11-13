import React from 'react';

export const AccountCardSkeleton: React.FC = () => {
	return (
		<div className='flex-shrink-0 w-full'>
			<div className='flex flex-col justify-between bg-[var(--card)] h-[100px] rounded-[8px] p-4 animate-pulse'>
				<div className='h-[18px] w-2/5 bg-[var(--skeleton)] rounded' />

				<div className='flex items-baseline gap-2'>
					<div className='h-[24px] w-2/3 bg-[var(--skeleton)] rounded' />
					<div className='h-[18px] w-1/6 bg-[var(--skeleton)] rounded' />
				</div>
			</div>
		</div>
	);
};
