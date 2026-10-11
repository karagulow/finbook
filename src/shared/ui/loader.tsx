import React from 'react';
import { cn } from '../lib';

interface Props {
	size?: number;
	className?: string;
}

export const Loader: React.FC<Props> = ({ size = 24, className }) => {
	return (
		<span
			role='status'
			aria-label='Загрузка'
			className={cn('inline-flex shrink-0', className)}
			style={{ width: size, height: size }}
		>
			<svg
				viewBox='0 0 24 24'
				fill='none'
				aria-hidden
				className='size-full animate-spin'
			>
				<circle
					cx='12'
					cy='12'
					r='9'
					stroke='currentColor'
					strokeWidth='2.5'
					className='opacity-25'
				/>
				<path
					d='M21 12a9 9 0 0 0-9-9'
					stroke='currentColor'
					strokeWidth='2.5'
					strokeLinecap='round'
				/>
			</svg>
		</span>
	);
};
