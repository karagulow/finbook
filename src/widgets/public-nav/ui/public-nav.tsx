'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { AppIcon, Container } from '@/src/shared/ui';
import { lockBody, unlockBody } from '@/src/shared/lib';
import { NAV_LINKS } from '../model/links';
import { BurgerButton } from './burger-button';
import { PublicMobileNav } from './public-mobile-nav';

export const PublicNav: React.FC = () => {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!open) return;

		lockBody();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false);
		};

		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.removeEventListener('keydown', onKeyDown);
			unlockBody();
		};
	}, [open]);

	useEffect(() => {
		const media = window.matchMedia('(min-width: 768px)');
		const onChange = () => {
			if (media.matches) setOpen(false);
		};

		media.addEventListener('change', onChange);
		return () => media.removeEventListener('change', onChange);
	}, []);

	return (
		<>
			<nav className='sticky top-0 z-20 w-full border-b-[0.5px] border-[var(--border-primary)] bg-[var(--background-primary)]/70 backdrop-blur-md'>
				<Container
					width={1280}
					className='flex h-16 flex-row items-center justify-between gap-2'
				>
					<Link
						href='/'
						className='flex shrink-0 flex-row items-center gap-3'
						onClick={() => setOpen(false)}
					>
						<AppIcon
							src='/icons/maskable-icon.png'
							alt='Финкнижка'
							size={32}
							priority
						/>
						<span className='hidden md:block font-semibold text-[19px] text-[var(--foreground-primary)]'>
							Финкнижка
						</span>
					</Link>

					<div className='flex flex-row items-center gap-1 sm:gap-3'>
						<div className='hidden md:flex flex-row items-center'>
							{NAV_LINKS.map(link => (
								<Link
									key={link.href}
									href={link.href}
									className='px-3.5 py-1.5 font-medium text-[13px] text-[var(--foreground-secondary)] hover:text-[var(--foreground-primary)] hover:bg-[var(--muted)] rounded-full transition'
								>
									{link.label}
								</Link>
							))}
						</div>

						<span
							aria-hidden
							className='hidden md:block h-4 w-px bg-[var(--border-primary)]'
						/>

						<div className='flex flex-row items-center gap-1 sm:gap-2'>
							<Link
								href='/login'
								className='px-3 py-1.5 sm:px-3.5 font-medium text-[13px] text-[var(--foreground-secondary)] hover:text-[var(--foreground-primary)] hover:bg-[var(--muted)] rounded-full transition'
							>
								Войти
							</Link>
							<Link
								href='/registration'
								className='flex flex-row items-center justify-center rounded-full px-3 py-1.5 sm:px-3.5 bg-[var(--button-primary)] text-[13px] font-semibold text-[var(--foreground-inverse)] hover:bg-[var(--button-primary-hover)] transition'
							>
								Регистрация
							</Link>
							<BurgerButton
								open={open}
								onClick={() => setOpen(value => !value)}
							/>
						</div>
					</div>
				</Container>
			</nav>

			<PublicMobileNav open={open} onClose={() => setOpen(false)} />
		</>
	);
};
