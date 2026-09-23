import React from 'react';

import { Container } from '@/src/shared/ui';
import { LandingCtaStarfield } from './cta-starfield';
import { LandingStartLink } from './start-link';

interface Props {
	authenticated: boolean;
}

export const LandingCta: React.FC<Props> = ({ authenticated }) => {
	return (
		<section className='py-8 sm:py-12'>
			<Container width={1280}>
				<div className='relative isolate overflow-hidden flex flex-col items-center justify-center rounded-3xl bg-[var(--card)] border-[0.5px] border-[var(--border-primary)] px-6 py-24 sm:py-32 text-center'>
					<LandingCtaStarfield />

					<h2 className='relative max-w-[18ch] font-semibold tracking-[-0.04em] text-[32px] leading-[1.1] sm:text-[44px] text-[var(--foreground-primary)]'>
						Создано для будущего.
						<br />
						Доступно уже сегодня.
					</h2>

					<LandingStartLink
						authenticated={authenticated}
						className='group relative mt-10 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 bg-[var(--button-primary)] text-[13px] font-semibold text-[var(--foreground-inverse)] hover:bg-[var(--button-primary-hover)] active:scale-97 transition duration-200'
					/>
				</div>
			</Container>
		</section>
	);
};
