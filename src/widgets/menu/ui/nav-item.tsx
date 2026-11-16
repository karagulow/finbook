'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

import { cn } from '@/src/shared/lib';
import { usePrefetchOnVisible } from '@/src/shared/hooks';

interface NavItemProps {
	icon: React.ReactNode;
	label: string;
	path: string;
	prefetch?: (queryClient: QueryClient) => void;
}

export const NavItem: React.FC<NavItemProps> = ({
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
				'flex flex-row items-center gap-2.5 rounded-[8px] py-2 px-2.5 hover:bg-[var(--muted)] border-[0.5px] border-transparent font-medium text-[13px] text-[var(--foreground-secondary)] transition',
				{
					'bg-[var(--muted)] text-[var(--foreground-primary)] border-[var(--border-primary)]':
						isActive,
				},
			)}
		>
			{icon}
			<span>{label}</span>
		</Link>
	);
};
function prefetch(): void {
	throw new Error('Function not implemented.');
}
