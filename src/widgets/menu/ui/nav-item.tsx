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
				'flex flex-row items-center gap-2.5 rounded-[4px] p-2.5 hover:bg-[var(--muted)] font-medium text-[13px] text-[var(--foreground-secondary)] transition',
				{
					'bg-[var(--muted)] text-[var(--foreground-primary)]': isActive,
				}
			)}
		>
			{icon}
			<span>{label}</span>
		</Link>
	);
};
