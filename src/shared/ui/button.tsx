import React from 'react';
import { cn } from '../lib';

interface Props {
	children: React.ReactNode;
	type?: 'button' | 'submit' | 'reset';
	variant?: 'default' | 'wrong';
	disabled?: boolean;
	onClick?: () => void;
	className?: string;
}

const variantStyles: Record<NonNullable<Props['variant']>, string> = {
	default:
		'bg-[var(--button-tertiary)] border-[var(--border-primary)] text-[var(--foreground-primary)] hover:bg-[var(--button-tertiary-hover)] hover:border-[var(--border-primary-hover)]',
	wrong:
		'bg-[var(--background-wrong)] border-[var(--border-wrong)] text-[var(--wrong)] hover:bg-[var(--background-wrong-hover)] hover:border-[var(--border-wrong-hover)]',
};

export const Button: React.FC<Props> = ({
	children,
	type = 'button',
	variant = 'default',
	disabled = false,
	onClick,
	className,
}) => {
	return (
		<button
			className={cn(
				'flex flex-row items-center justify-center gap-2 py-2.5 px-5 rounded-[6px] border-[0.5px] text-[13px] font-semibold active:scale-99 transition cursor-pointer',
				variantStyles[variant],
				disabled && 'opacity-50 pointer-events-none',
				className
			)}
			type={type}
			disabled={disabled}
			onClick={onClick}
		>
			{children}
		</button>
	);
};
