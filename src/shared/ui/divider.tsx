import React from 'react';
import { cn } from '../lib';

interface Props {
	className?: string;
}

export const Divider: React.FC<Props> = ({ className }) => {
	return (
		<hr
			className={cn(
				'w-full border-[0.5px] border-[var(--border-primary)]',
				className
			)}
		/>
	);
};
