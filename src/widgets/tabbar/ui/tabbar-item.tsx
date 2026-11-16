'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

import { cn } from '@/src/shared/lib';
import { usePrefetchOnVisible } from '@/src/shared/hooks';

interface Props {
	icon: React.ReactNode;
	label: string;
	path: string;
	prefetch?: (queryClient: QueryClient) => void;
}

export const TabbarItem: React.FC<Props> = ({
	icon,
	label,
	path,
	prefetch,
}) => {
	const pathname = usePathname();
	const isActive = pathname === path;

	const queryClient = useQueryClient();

	const ref = usePrefetchOnVisible({
		onVisible: prefetch ? () => prefetch(queryClient) : undefined,
	});

	return (
		<Link
			ref={ref}
			href={path}
			className={cn(
				'flex flex-col gap-0.5 items-center justify-center w-full h-full font-medium text-[10px] text-[var(--foreground-secondary)] transition',
				{
					'text-[var(--foreground-primary)]': isActive,
				},
			)}
		>
			{icon}
			<span>{label}</span>
		</Link>
	);
};
