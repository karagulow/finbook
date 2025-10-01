'use client';

import { useEffect, useState } from 'react';
import { cn } from '../lib';

export const TopBlurOverlay: React.FC = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 40) {
				setVisible(true);
			} else {
				setVisible(false);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<div
			className={cn(
				'progressive-blur pointer-events-none fixed inset-0 z-9 h-30 w-screen lg:h-15 transition-transform duration-500',
				visible ? 'translate-y-0' : '-translate-y-full'
			)}
		></div>
	);
};
