'use client';

import React from 'react';

import { useAnimatedNumber } from '@/src/shared/hooks';

interface Props {
	icon: string;
	progress: number;
}

const SIZE = 64;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const GoalProgress: React.FC<Props> = ({ icon, progress }) => {
	const clamped = Math.min(100, Math.max(0, progress));
	const animated = useAnimatedNumber(clamped);
	const offset = CIRCUMFERENCE - (animated / 100) * CIRCUMFERENCE;

	return (
		<div className='relative shrink-0' style={{ width: SIZE, height: SIZE }}>
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
				{animated > 0 && (
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
			<span className='absolute inset-0 flex items-center justify-center text-[26px] leading-none'>
				{icon}
			</span>
		</div>
	);
};
