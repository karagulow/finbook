import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { AppIcon, Container } from '@/src/shared/ui';

export const LandingHero: React.FC = () => {
	return (
		<section className='relative overflow-hidden'>
			<div
				aria-hidden
				className='pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_72px,var(--border-primary)_72px,var(--border-primary)_73px)] opacity-15 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_70%,transparent)]'
			/>

			<Container
				width={1280}
				className='relative flex flex-col items-start md:items-center pt-10 pb-0 sm:pt-16'
			>
				<div className='landing-enter inline-flex items-center gap-2 rounded-full border-[0.5px] border-[var(--border-primary)] bg-[var(--muted)]/80 px-2.5 py-1 backdrop-blur-sm'>
					<AppIcon
						src='/icons/maskable-icon.png'
						alt=''
						size={16}
						className='rounded-[5px]'
					/>
					<span className='font-medium text-[13px] text-[var(--foreground-primary)]'>
						Работает в браузере как приложение
					</span>
				</div>

				<h1
					style={{ '--landing-order': 1 } as React.CSSProperties}
					className='landing-enter mt-6 max-w-[630px] text-start md:text-center font-semibold tracking-[-0.04em] text-[36px] leading-[1.08] sm:text-[52px] text-[var(--foreground-primary)]'
				>
					Начните лучше понимать свои финансы
				</h1>

				<p
					style={{ '--landing-order': 2 } as React.CSSProperties}
					className='landing-enter mt-5 max-w-[630px] text-start md:text-center font-medium text-[15px] sm:text-[16px] leading-relaxed text-[var(--foreground-secondary)]'
				>
					Соберите свои счета и операции в одном месте, чтобы видеть полную
					картину финансов, контролировать расходы и планировать будущее.
				</p>

				<div
					style={{ '--landing-order': 3 } as React.CSSProperties}
					className='landing-enter mt-8 flex flex-row flex-wrap items-center justify-center gap-2'
				>
					<Link
						href='/registration'
						className='group inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 bg-[var(--button-primary)] text-[13px] font-semibold text-[var(--foreground-inverse)] hover:bg-[var(--button-primary-hover)] active:scale-97 transition duration-200'
					>
						Начать бесплатно
						<span className='relative inline-flex size-3.5'>
							<ArrowRight
								size={14}
								strokeWidth={2}
								className='absolute inset-0 transition-transform duration-300 ease-out group-hover:translate-x-1'
							/>
						</span>
					</Link>
				</div>
			</Container>

			<div className='landing-mockup relative mt-14 sm:mt-20'>
				<Image
					src='/images/home-laptop-mockup.png'
					alt='Главная страница Финкнижки на ноутбуке'
					width={1920}
					height={1080}
					priority
					className='relative mx-auto w-full max-w-[1280px] h-auto select-none pointer-events-none'
				/>
				<div
					aria-hidden
					className='pointer-events-none absolute inset-x-0 bottom-0 h-[28%] sm:h-[32%] bg-gradient-to-t from-[var(--background-primary)] from-15% via-[var(--background-primary)]/80 to-transparent'
				/>
			</div>
		</section>
	);
};
