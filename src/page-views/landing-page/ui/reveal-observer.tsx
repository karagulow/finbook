'use client';

import React, { useEffect } from 'react';

const REVEAL_SELECTOR = '.landing-reveal';

export const LandingRevealObserver: React.FC = () => {
	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const observer = new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const el = entry.target as HTMLElement;
					el.dataset.reveal = 'shown';
					observer.unobserve(el);
				}
			},
			{ rootMargin: '0px 0px -5% 0px', threshold: 0.05 },
		);

		const elements = document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);
		for (const el of elements) {
			if (el.getBoundingClientRect().top < window.innerHeight) continue;
			el.dataset.reveal = 'hidden';
			observer.observe(el);
		}

		return () => observer.disconnect();
	}, []);

	return null;
};
