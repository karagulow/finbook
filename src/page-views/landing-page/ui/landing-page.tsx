import React from 'react';
import { LandingHero } from './hero';
import { LandingShowcase } from './showcase';
import { LandingFeatures } from './features';
import { LandingFaq } from './faq';
import { LandingCta } from './cta';
import { LandingHashScroll } from './hash-scroll';
import { LandingRevealObserver } from './reveal-observer';

interface Props {
	authenticated: boolean;
}

export const LandingPage: React.FC<Props> = ({ authenticated }) => {
	return (
		<div className='flex flex-col'>
			<LandingHero authenticated={authenticated} />
			<LandingShowcase />
			<LandingFeatures />
			<LandingFaq />
			<LandingCta authenticated={authenticated} />
			<LandingRevealObserver />
			<LandingHashScroll />
		</div>
	);
};
