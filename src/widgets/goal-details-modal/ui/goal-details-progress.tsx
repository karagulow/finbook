import React from 'react';

interface Props {
	icon: string;
	progress: number;
}

const SIZE = 96;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const GoalDetailsProgress: React.FC<Props> = ({ icon, progress }) => {
	const clamped = Math.min(100, Math.max(0, progress));
	const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

	return (
		<div className='relative size-24 shrink-0'>
			<svg
				className='size-full -rotate-90'
				viewBox={`0 0 ${SIZE} ${SIZE}`}
				aria-hidden
			>
				<circle
					cx={SIZE / 2}
					cy={SIZE / 2}
					r={RADIUS}
					fill='none'
					stroke='var(--border-primary-hover)'
					strokeWidth={STROKE}
				/>
				{clamped > 0 && (
					<circle
						cx={SIZE / 2}
						cy={SIZE / 2}
						r={RADIUS}
						fill='none'
						stroke='var(--foreground-primary)'
						strokeWidth={STROKE}
						strokeLinecap='round'
						strokeDasharray={CIRCUMFERENCE}
						strokeDashoffset={offset}
					/>
				)}
			</svg>
			<span className='absolute inset-0 flex items-center justify-center text-[32px] leading-none'>
				{icon}
			</span>
		</div>
	);
};
