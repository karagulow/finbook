import React, { memo } from 'react';

import { cn } from '@/src/shared/lib';

import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
	disabled?: boolean;
	direction: 'left' | 'right';
	onClick?: () => void;
}

export const ArrowButton: React.FC<Props> = memo(
	({ disabled = false, direction, onClick }) => {
		return (
			<button
				className={cn(
					'flex items-center justify-center w-full h-full rounded-[8px] bg-[var(--button-tertiary)] text-[var(--foreground-secondary)] hover:bg-[var(--button-tertiary-hover)] hover:text-[var(--foreground-primary)] active:scale-99 transition cursor-pointer',
					{ 'opacity-50 pointer-events-none': disabled }
				)}
				disabled={disabled}
				onClick={onClick}
			>
				{direction === 'left' && <ArrowLeft strokeWidth={1.5} />}
				{direction === 'right' && <ArrowRight strokeWidth={1.5} />}
			</button>
		);
	}
);
