'use client';

import React from 'react';
import { cn } from '@/src/shared/lib';

interface Props {
	open: boolean;
	onClick: () => void;
}

export const BurgerButton: React.FC<Props> = ({ open, onClick }) => {
	return (
		<button
			type='button'
			aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
			aria-expanded={open}
			aria-controls='public-mobile-nav'
			onClick={onClick}
			className='relative flex size-10 items-center justify-center md:hidden text-[var(--foreground-primary)]'
		>
			<span className='relative block h-2 w-3.5'>
				<span
					className={cn(
						'absolute top-1/2 left-0 h-[1.5px] w-full -mt-[0.75px] rounded-full bg-current origin-center transition-transform duration-300 ease-out',
						open ? 'rotate-45' : '-translate-y-[2.5px]',
					)}
				/>
				<span
					className={cn(
						'absolute top-1/2 left-0 h-[1.5px] w-full -mt-[0.75px] rounded-full bg-current origin-center transition-transform duration-300 ease-out',
						open ? '-rotate-45' : 'translate-y-[2.5px]',
					)}
				/>
			</span>
		</button>
	);
};
