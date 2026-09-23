import React from 'react';
import { LandingHero } from './hero';
import { LandingShowcase } from './showcase';
import { LandingFeatures } from './features';
import { LandingFaq } from './faq';
import { LandingCta } from './cta';
import { LandingRevealObserver } from './reveal-observer';

export const LandingPage: React.FC = () => {
	return (
		<div className='flex flex-col'>
			<LandingHero />
			<LandingShowcase />
			<LandingFeatures />
			<LandingFaq />
			<LandingCta />
			<LandingRevealObserver />
		</div>
	);
};
