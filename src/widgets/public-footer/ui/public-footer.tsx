'use client';

import React from 'react';
import Link from 'next/link';

import { siteConfig } from '@/src/shared/config/site';
import { AppIcon, Container } from '@/src/shared/ui';
import { LANDING_SECTIONS } from '@/src/page-views/landing-page/model/sections';
import { PublicNavLink } from '@/src/widgets/public-nav/ui/public-nav-link';

const linkClassName =
	'font-medium text-[13px] text-[var(--foreground-secondary)] transition hover:text-[var(--foreground-primary)]';

export const PublicFooter: React.FC = () => {
	return (
		<footer className='border-t-[0.5px] border-[var(--border-primary)] pb-[env(safe-area-inset-bottom)]'>
			<Container width={1280} className='py-12 sm:py-16'>
				<div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_auto_auto] lg:gap-16'>
					<div className='sm:col-span-2 lg:col-span-1'>
						<Link href='/' className='inline-flex items-center gap-3'>
							<AppIcon src='/icons/maskable-icon.png' alt='' size={32} />
							<span className='font-semibold text-[19px] text-[var(--foreground-primary)]'>
								{siteConfig.name}
							</span>
						</Link>
						<p className='mt-4 max-w-[36ch] font-medium text-[13px] leading-relaxed text-[var(--foreground-secondary)]'>
							{siteConfig.description}
						</p>
					</div>

					<nav aria-label='Разделы' className='flex flex-col gap-3'>
						<p className='font-semibold text-[13px] text-[var(--foreground-primary)]'>
							Разделы
						</p>
						<ul className='flex flex-col gap-2'>
							{LANDING_SECTIONS.map(section => (
								<li key={section.id}>
									<PublicNavLink
										section={section}
										className={linkClassName}
									/>
								</li>
							))}
						</ul>
					</nav>

					<nav aria-label='Аккаунт' className='flex flex-col gap-3'>
						<p className='font-semibold text-[13px] text-[var(--foreground-primary)]'>
							Аккаунт
						</p>
						<ul className='flex flex-col gap-2'>
							<li className='guest-only'>
								<Link href='/login' className={linkClassName}>
									Войти
								</Link>
							</li>
							<li className='guest-only'>
								<Link href='/registration' className={linkClassName}>
									Регистрация
								</Link>
							</li>
							<li className='session-only'>
								<Link href='/home' className={linkClassName}>
									Личный кабинет
								</Link>
							</li>
						</ul>
					</nav>
				</div>

				<p className='mt-12 border-t-[0.5px] border-[var(--border-primary)] pt-6 font-medium text-[13px] text-[var(--foreground-secondary)]'>
					© {new Date().getFullYear()} {siteConfig.name}
				</p>
			</Container>
		</footer>
	);
};
