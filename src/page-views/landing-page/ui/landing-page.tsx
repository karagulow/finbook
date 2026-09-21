import React from 'react';
import { LandingHero } from './hero';
import { LandingFaq } from './faq';

export const LandingPage: React.FC = () => {
	return (
		<div className='flex flex-col'>
			<LandingHero />
			<LandingFaq />
		</div>
	);
};
