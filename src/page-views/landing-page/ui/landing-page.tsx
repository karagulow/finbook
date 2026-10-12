import React from 'react';
import { LandingHero } from './hero';
import { LandingShowcase } from './showcase';
import { LandingPlans } from './plans';
import { LandingData } from './data';
import { LandingFeatures } from './features';
import { LandingFaq } from './faq';
import { LandingCta } from './cta';
import { LandingHashScroll } from './hash-scroll';
import { LandingRevealObserver } from './reveal-observer';

export const LandingPage: React.FC = () => {
	return (
		<div className='flex flex-col'>
			<LandingHero />
			<LandingShowcase />
			<LandingPlans />
			<LandingData />
			<LandingFeatures />
			<LandingFaq />
			<LandingCta />
			<LandingRevealObserver />
			<LandingHashScroll />
		</div>
	);
};
