'use client';

import { useLayoutEffect } from 'react';

import { flushQueuedLandingScroll } from '@/src/widgets/public-nav/model/scroll-to-section';

export const LandingHashScroll: React.FC = () => {
	useLayoutEffect(() => {
		flushQueuedLandingScroll();
	}, []);

	return null;
};
