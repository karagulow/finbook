'use client';

import { useEffect, useRef, useState } from 'react';

export type EmojiPhase = 'idle' | 'exit' | 'enter';

export const useEmojiAnimation = (selectedEmoji?: string) => {
	const [displayedEmoji, setDisplayedEmoji] = useState(selectedEmoji);
	const [phase, setPhase] = useState<EmojiPhase>('idle');

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		if (selectedEmoji === displayedEmoji) {
			return;
		}

		setPhase('exit');

		timerRef.current = setTimeout(() => {
			setDisplayedEmoji(selectedEmoji);
			setPhase('enter');

			timerRef.current = setTimeout(() => {
				setPhase('idle');
				timerRef.current = null;
			}, 100);
		}, 100);

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [selectedEmoji, displayedEmoji]);

	return { displayedEmoji, phase };
};
