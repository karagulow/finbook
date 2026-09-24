import React from 'react';
import Image from 'next/image';

import { Container } from '@/src/shared/ui';
import { landingSection } from '../model/sections';
import { SHOWCASE_ITEMS } from '../model/showcase';

const PANEL_NOISE =
	'url("data:image/svg+xml;charset=utf-8,%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22250%22%20height%3D%22250%22%20viewBox%3D%220%200%20100%20100%22%3E%20%3Cfilter%20id%3D%22n%22%3E%20%3CfeTurbulence%20type%3D%22turbulence%22%20baseFrequency%3D%221.4%22%20numOctaves%3D%221%22%20seed%3D%222%22%20stitchTiles%3D%22stitch%22%20result%3D%22n%22%20%2F%3E%20%3CfeComponentTransfer%20result%3D%22g%22%3E%20%3CfeFuncR%20type%3D%22linear%22%20slope%3D%224%22%20intercept%3D%221%22%20%2F%3E%20%3CfeFuncG%20type%3D%22linear%22%20slope%3D%224%22%20intercept%3D%221%22%20%2F%3E%20%3CfeFuncB%20type%3D%22linear%22%20slope%3D%224%22%20intercept%3D%221%22%20%2F%3E%20%3C%2FfeComponentTransfer%3E%20%3CfeColorMatrix%20type%3D%22saturate%22%20values%3D%220%22%20in%3D%22g%22%20%2F%3E%20%3C%2Ffilter%3E%20%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%20%2F%3E%20%3C%2Fsvg%3E%20")';

export const LandingShowcase: React.FC = () => {
	return (
		<section id={landingSection.how.id} className='scroll-mt-20 py-16 sm:py-24'>
			<Container width={1280}>
				<h2 className='max-w-[14em] font-semibold tracking-[-0.04em] text-[36px] leading-[1.08] sm:text-[52px] text-[var(--foreground-primary)]'>
					Ясность в ваших финансах.
				</h2>

				<p className='mt-5 max-w-[46ch] font-medium text-[15px] sm:text-[16px] leading-relaxed text-[var(--foreground-secondary)]'>
					Все счета, операции и аналитика в одном месте. Следите за деньгами и
					понимайте, на что их тратите.
				</p>

				<div className='mt-10 grid grid-cols-1 gap-4 sm:mt-14 lg:grid-cols-3'>
					{SHOWCASE_ITEMS.map((item, index) => (
						<article
							key={item.id}
							style={{ '--landing-order': index % 3 } as React.CSSProperties}
							className='landing-reveal flex h-full flex-col overflow-hidden rounded-[2rem] bg-[var(--card)] border-[0.5px] border-[var(--border-primary)] p-2 sm:min-h-[44rem]'
						>
							<div className='p-6 sm:p-10'>
								<h3 className='text-2xl font-semibold tracking-[-0.2px] text-pretty text-[var(--foreground-primary)]'>
									{item.title}
								</h3>
								<p className='mt-4 max-w-lg text-base/7 font-normal text-[var(--foreground-secondary)]'>
									{item.text}
								</p>
							</div>

							<div
								className={`relative flex h-[30rem] items-start justify-center overflow-hidden rounded-[1.5rem] px-8 pt-8 sm:mt-auto sm:h-auto sm:min-h-[31rem] sm:items-end sm:pt-10 ${item.panelClassName}`}
							>
								<div
									aria-hidden
									className='pointer-events-none absolute inset-0 mix-blend-overlay opacity-25'
									style={{
										backgroundPosition: 'center',
										backgroundImage: PANEL_NOISE,
									}}
								/>
								<Image
									src={item.image}
									alt=''
									width={450}
									height={920}
									className='relative h-auto w-full max-w-[19rem] transition-[translate] duration-500 select-none sm:translate-y-16 sm:hover:translate-y-12 drop-shadow-[0_14px_20px_rgba(0,0,0,0.42)]'
								/>
							</div>
						</article>
					))}
				</div>
			</Container>
		</section>
	);
};
