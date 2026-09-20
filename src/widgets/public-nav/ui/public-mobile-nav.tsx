'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/src/shared/lib';
import { Container } from '@/src/shared/ui';
import { NAV_LINKS } from '../model/links';

interface Props {
	open: boolean;
	onClose: () => void;
}

export const PublicMobileNav: React.FC<Props> = ({ open, onClose }) => {
	return (
		<div
			id='public-mobile-nav'
			aria-hidden={!open}
			inert={!open}
			className={cn(
				'fixed inset-x-0 top-16 bottom-0 z-10 overflow-y-auto bg-[var(--background-primary)]/70 backdrop-blur-md md:hidden transition-opacity duration-300 ease-out',
				open ? 'opacity-100' : 'pointer-events-none opacity-0',
			)}
		>
			<Container width={1440} className='py-6'>
				<nav className='flex flex-col'>
					{NAV_LINKS.map((link, index) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={onClose}
							style={{ transitionDelay: open ? `${80 + index * 45}ms` : '0ms' }}
							className={cn(
								'py-1.5 font-medium text-[28px] leading-tight text-[var(--foreground-primary)] transition duration-300 ease-out',
								open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
							)}
						>
							{link.label}
						</Link>
					))}
				</nav>
			</Container>
		</div>
	);
};
