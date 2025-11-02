'use client';

import { useEffect, useState } from 'react';
import { cn } from '../lib';

interface Props {
	title: string;
}

export const StickyHeader: React.FC<Props> = ({ title }) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setVisible(window.scrollY > 40);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<div className='fixed block lg:hidden top-0 left-0 w-full bg-[var(--background-primary)]/70 backdrop-blur-md z-10 pt-[calc(env(safe-area-inset-top)+10px)]'>
			<div
				className={cn(
					'pb-2.5 text-center font-semibold text-[15px] text-[var(--foreground-primary)] transition-opacity duration-300',
					visible ? 'opacity-100' : 'opacity-0'
				)}
			>
				{title}
			</div>
		</div>
	);
};
