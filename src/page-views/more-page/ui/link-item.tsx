'use client';

import Link from 'next/link';
import React from 'react';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

import { usePrefetchOnVisible } from '@/src/shared/hooks';

interface Props {
	title: string;
	description: string;
	path: string;
	icon?: React.ReactNode;
	prefetch?: (queryClient: QueryClient) => void;
}

export const LinkItem: React.FC<Props> = ({
	title,
	description,
	path,
	icon,
	prefetch,
}) => {
	const queryClient = useQueryClient();

	const ref = usePrefetchOnVisible({
		onVisible: prefetch ? () => prefetch(queryClient) : undefined,
	});

	return (
		<Link
			ref={ref}
			href={path}
			className='flex flex-row items-start justify-between gap-2.5 px-4 py-3 rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--border-primary)] active:scale-99 transition'
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
