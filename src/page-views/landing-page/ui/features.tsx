import React from 'react';
import {
	ChartColumn,
	Wallet,
	Lock,
	MonitorSmartphone,
	Sparkles,
	Tags,
	type LucideIcon,
} from 'lucide-react';

import { Container } from '@/src/shared/ui';
import { FEATURES } from '../model/features';

const FEATURE_ICONS: Record<
	(typeof FEATURES)[number]['id'],
	{ icon: LucideIcon; className: string }
> = {
	privacy: { icon: Lock, className: 'text-[#8e8e93]' },
	devices: { icon: MonitorSmartphone, className: 'text-[#3b9eff]' },
	analytics: { icon: ChartColumn, className: 'text-[#30c85a]' },
	currencies: { icon: Wallet, className: 'text-[#f5a524]' },
	categories: { icon: Tags, className: 'text-[#bf5af2]' },
	free: { icon: Sparkles, className: 'text-[#5ac8f5]' },
};

export const LandingFeatures: React.FC = () => {
	return (
		<section id='features' className='scroll-mt-20 py-16 sm:py-24'>
			<Container width={960} className='flex flex-col items-center'>
				<h2 className='max-w-[12em] text-center font-semibold tracking-[-0.04em] text-[36px] leading-[1.08] sm:text-[52px] text-[var(--foreground-primary)]'>
					Ещё причины открывать Финкнижку каждый день.
				</h2>

				<p className='mt-5 max-w-[42ch] text-center font-medium text-[15px] sm:text-[16px] leading-relaxed text-[var(--foreground-secondary)]'>
					Продуманные детали, которые помогают держать финансы в порядке.
				</p>

				<div className='mt-10 grid w-full grid-cols-1 gap-3 sm:mt-14 md:grid-cols-2 md:gap-4'>
					{FEATURES.map(feature => {
						const { icon: Icon, className } = FEATURE_ICONS[feature.id];

						return (
							<article
								key={feature.id}
								className='rounded-[22px] bg-[var(--card)] px-5 py-5 sm:px-6 sm:py-6 border-[0.5px] border-[var(--border-primary)]'
							>
								<div className='mb-5 flex size-14 items-center justify-center rounded-[14px] bg-[var(--background-primary)] border-[0.5px] border-[var(--border-primary)]'>
									<Icon
										size={32}
										strokeWidth={1.75}
										aria-hidden
										className={className}
									/>
								</div>

								<p className='text-[15px] leading-relaxed'>
									<span className='font-semibold text-[var(--foreground-primary)]'>
										{feature.title}
									</span>{' '}
									<span className='font-medium text-[var(--foreground-secondary)]'>
										{feature.text}
									</span>
								</p>
							</article>
						);
					})}
				</div>
			</Container>
		</section>
	);
};
