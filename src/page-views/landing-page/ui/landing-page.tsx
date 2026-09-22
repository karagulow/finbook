import React from 'react';
import { LandingHero } from './hero';
import { LandingFeatures } from './features';
import { LandingFaq } from './faq';
import { LandingCta } from './cta';

export const LandingPage: React.FC = () => {
	return (
		<div className='flex flex-col'>
			<LandingHero />
			<LandingFeatures />
			<LandingFaq />
			<LandingCta />
		</div>
	);
};
