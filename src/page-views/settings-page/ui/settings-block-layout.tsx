import { cn } from '@/src/shared/lib';
import React from 'react';

interface SettingsBlockLayoutProps {
	title?: string;
	children?: React.ReactNode;
}

interface SettingsBlockItemProps {
	children?: React.ReactNode;
	className?: string;
}

export const SettingsBlockLayout: React.FC<SettingsBlockLayoutProps> = ({
	title,
	children,
}) => {
	return (
		<div className='flex flex-col gap-4 sm:gap-5 w-full p-5 bg-[var(--card)] border-[0.5px] border-[var(--border-primary)] rounded-[16px] font-medium text-[13px] text-[var(--foreground-secondary)]'>
			<h2 className='font-bold text-[19px] text-[var(--foreground-primary)]'>
				{title}
			</h2>
			{children}
		</div>
	);
};

export const SettingsBlockItem: React.FC<SettingsBlockItemProps> = ({
	children,
	className,
}) => {
	return (
		<div
			className={cn(
				'flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-5 sm:gap-2.5',
				className,
			)}
		>
			{children}
		</div>
	);
};
