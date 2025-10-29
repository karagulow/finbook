import Link from 'next/link';
import React from 'react';

interface Props {
	title: string;
	description: string;
	path: string;
	icon?: React.ReactNode;
}

export const LinkItem: React.FC<Props> = ({
	title,
	description,
	path,
	icon,
}) => {
	return (
		<Link
			className='flex flex-row items-start justify-between gap-2.5 p-3 rounded-[8px] bg-[var(--card)] active:scale-99 transition'
			href={path}
		>
			<div className='flex flex-col gap-1.5'>
				<p className='font-bold text-[17px] text-[var(--foreground-primary)]'>
					{title}
				</p>
				<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
					{description}
				</p>
			</div>

			<div className='text-[var(--foreground-primary)]'>{icon}</div>
		</Link>
	);
};
