'use client';

import { useEffect, useRef, useState } from 'react';

const easeOut = (t: number) => 1 - (1 - t) ** 3;

export const useAnimatedNumber = (target: number, duration = 500) => {
	const [value, setValue] = useState(target);
	const valueRef = useRef(target);

	useEffect(() => {
		const from = valueRef.current;
		if (Object.is(from, target)) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			valueRef.current = target;
			setValue(target);
			return;
		}

		const start = performance.now();
		let frame = 0;

		const tick = (now: number) => {
			const progress = Math.min(1, (now - start) / duration);
			const next = from + (target - from) * easeOut(progress);
			valueRef.current = next;
			setValue(next);

			if (progress < 1) {
				frame = requestAnimationFrame(tick);
				return;
			}

			valueRef.current = target;
			setValue(target);
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [target, duration]);

	return value;
};
