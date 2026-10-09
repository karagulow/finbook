'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib';

interface Props {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: React.ReactNode;
	disabled?: boolean;
	className?: string;
}

export const Checkbox: React.FC<Props> = ({
	checked,
	onChange,
	label,
	disabled = false,
	className,
}) => {
	return (
		<label
			className={cn(
				'flex w-fit items-center gap-2.5 cursor-pointer',
				disabled && 'pointer-events-none opacity-50',
				className,
			)}
		>
			<input
				type='checkbox'
				checked={checked}
				disabled={disabled}
				onChange={event => onChange(event.target.checked)}
				className='peer sr-only'
			/>
			<span
				aria-hidden
				className={cn(
					'flex size-4 shrink-0 items-center justify-center rounded-full border transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--foreground-primary)]',
					checked
						? 'border-[var(--foreground-primary)] bg-[var(--foreground-primary)] text-[var(--foreground-inverse)]'
						: 'border-[var(--foreground-secondary)] bg-transparent text-transparent',
				)}
			>
				<Check size={12} strokeWidth={3} />
			</span>
			{label != null && (
				<span className='text-[15px] text-[var(--foreground-primary)]'>
					{label}
				</span>
			)}
		</label>
	);
};
