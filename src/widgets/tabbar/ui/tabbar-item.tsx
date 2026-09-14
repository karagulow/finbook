'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/src/shared/lib';

interface Props {
	icon: React.ReactNode;
	label: string;
	path: string;
}

export const TabbarItem: React.FC<Props> = ({ icon, label, path }) => {
	const pathname = usePathname();
	const isActive = pathname === path;

	return (
		<Link
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
