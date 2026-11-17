'use client';

import { useEffect, useRef } from 'react';

interface Props {
	onVisible?: () => void;
	rootMargin?: string;
}

export function usePrefetchOnVisible({
	onVisible,
	rootMargin = '100px',
}: Props) {
	const ref = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		const element = ref.current;

		if (!element || !onVisible) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;

				observer.disconnect();
				onVisible();
			},
			{
				rootMargin,
				threshold: 0,
			},
		);

		observer.observe(element);

		return () => observer.disconnect();
	}, [onVisible, rootMargin]);

	return ref;
}
