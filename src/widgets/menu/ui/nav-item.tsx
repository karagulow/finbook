'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/src/shared/lib';

interface NavItemProps {
	icon: React.ReactNode;
	label: string;
	path: string;
}

export const NavItem: React.FC<NavItemProps> = ({ icon, label, path }) => {
	const pathname = usePathname();
	const isActive = pathname === path;

	return (
		<Link
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
