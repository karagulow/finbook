'use client';

import { useEffect, useState } from 'react';
import { cn } from '../lib';

interface Props {
	title: string;
}

const SCRIM_HEIGHT = 'h-[calc(env(safe-area-inset-top)+100px)]';

const WASH_MASK =
	'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.9) 26%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,0.22) 68%, rgba(0,0,0,0.07) 86%, transparent 100%)';

const BLUR_LAYERS = [
	{
		blur: '0.4px',
		mask: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 64%, rgba(0,0,0,0.2) 86%, transparent 100%)',
	},
	{
		blur: '1px',
		mask: 'linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.7) 42%, rgba(0,0,0,0.28) 64%, transparent 86%)',
	},
	{
		blur: '2px',
		mask: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.62) 32%, rgba(0,0,0,0.16) 54%, transparent 76%)',
	},
];

function layerStyle(mask: string, blur?: string): React.CSSProperties {
	return {
		WebkitMaskImage: mask,
		maskImage: mask,
		...(blur
			? {
					WebkitBackdropFilter: `blur(${blur})`,
					backdropFilter: `blur(${blur})`,
				}
			: {}),
	};
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
		<div className='pointer-events-none fixed top-0 left-0 z-10 block w-full lg:hidden'>
			<div aria-hidden className={cn('absolute inset-x-0 top-0', SCRIM_HEIGHT)}>
				{BLUR_LAYERS.map(layer => (
					<div
						key={layer.blur}
						className='absolute inset-0'
						style={layerStyle(layer.mask, layer.blur)}
					/>
				))}
				<div
					className='absolute inset-0 bg-[var(--background-primary)]/90'
					style={layerStyle(WASH_MASK)}
				/>
			</div>
			<div
				className={cn(
					'relative pt-[calc(env(safe-area-inset-top)+10px)] pb-2.5 text-center text-[15px] font-semibold text-[var(--foreground-primary)] transition-opacity duration-300',
					visible ? 'opacity-100' : 'opacity-0',
				)}
			>
				{title}
			</div>
		</div>
	);
};
