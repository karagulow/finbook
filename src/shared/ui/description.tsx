import React from 'react';

interface Props {
	label: string;
	text?: string;
}

export const Description: React.FC<Props> = ({ label, text }) => {
	return (
		<div className='flex flex-col items-start gap-1.5'>
			<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
				{label}
			</span>
			<div className='px-3.5 py-3 w-full h-fit min-h-[150px] border-[0.5px] border-[var(--border-primary)] rounded-[6px] font-medium text-[15px] text-[var(--foreground-primary)]'>
				{text}
			</div>
		</div>
	);
};
