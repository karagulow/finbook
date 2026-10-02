import React from 'react';
import { cn } from '../lib';

interface Props {
	children: React.ReactNode;
	width: number | string;
	className?: string;
}

export const Container: React.FC<Props> = ({ children, width, className }) => {
	return (
		<div
			className={cn('w-full mx-auto px-4 sm:px-5', className)}
			style={{ maxWidth: typeof width === 'number' ? `${width}px` : width }}
		>
			{children}
		</div>
	);
};
