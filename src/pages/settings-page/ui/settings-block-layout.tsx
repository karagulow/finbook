import React from 'react';

interface SettingsBlockLayoutProps {
	title?: string;
	children?: React.ReactNode;
}

interface SettingsBlockItemProps {
	children?: React.ReactNode;
}

export const SettingsBlockLayout: React.FC<SettingsBlockLayoutProps> = ({
	title,
	children,
}) => {
	return (
		<div className='flex flex-col gap-4 sm:gap-5 w-full p-5 bg-[var(--card)] rounded-[8px] font-medium text-[13px] text-[var(--foreground-primary)]'>
			<h2 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
				{title}
			</h2>
			{children}
		</div>
	);
};

export const SettingsBlockItem: React.FC<SettingsBlockItemProps> = ({
	children,
}) => {
	return (
		<div className='flex flex-row items-center justify-between gap-2.5'>
			{children}
		</div>
	);
};
