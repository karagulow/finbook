'use client';

import { useEffect, useState } from 'react';

interface Props {
	title: string;
}

export const StickyHeader: React.FC<Props> = ({ title }) => {
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
			className={`fixed block lg:hidden top-0 left-0 w-full bg-[var(--background-primary)] border-b-[0.5px] border-[var(--border-primary)] shadow-md transition-transform duration-500 z-10 
        ${visible ? 'translate-y-0' : '-translate-y-full'}`}
		>
			<div className='py-2.5 text-center font-regular text-[15px] text-[var(--foreground-primary)]'>
				{title}
			</div>
		</div>
	);
};
