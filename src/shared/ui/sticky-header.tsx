'use client';

import { useEffect, useState } from 'react';
import { cn } from '../lib';

interface Props {
	title: string;
}

const SAFE = 'env(safe-area-inset-top)';
const below = (px: number) => `calc(${SAFE} + ${px}px)`;

const SCRIM_HEIGHT = 'h-[calc(env(safe-area-inset-top)+62px)]';

const WASH_MASK = `linear-gradient(to bottom, #000 0, #000 ${below(14)}, rgba(0,0,0,0.72) ${below(30)}, rgba(0,0,0,0.28) ${below(44)}, rgba(0,0,0,0.06) ${below(54)}, transparent ${below(62)})`;

const BLUR_LAYERS = [
	{
		blur: '0.4px',
		mask: `linear-gradient(to bottom, transparent 0, transparent ${below(22)}, rgba(0,0,0,0.55) ${below(36)}, rgba(0,0,0,0.16) ${below(48)}, transparent ${below(58)})`,
	},
	{
		blur: '1px',
		mask: `linear-gradient(to bottom, transparent 0, transparent ${below(10)}, rgba(0,0,0,0.7) ${below(24)}, rgba(0,0,0,0.22) ${below(38)}, transparent ${below(50)})`,
	},
	{
		blur: '2px',
		mask: `linear-gradient(to bottom, #000 0, #000 ${SAFE}, rgba(0,0,0,0.5) ${below(18)}, rgba(0,0,0,0.12) ${below(32)}, transparent ${below(44)})`,
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
