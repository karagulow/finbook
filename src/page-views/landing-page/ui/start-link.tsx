'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useHasSession } from '@/src/shared/lib/use-has-session';

interface Props {
	className?: string;
}

export const LandingStartLink: React.FC<Props> = ({ className }) => {
	const authenticated = useHasSession();
	return (
		<Link
			href={authenticated ? '/home' : '/registration'}
			className={className}
		>
			{authenticated ? 'Личный кабинет' : 'Начать бесплатно'}
			<span className='relative inline-flex size-3.5'>
				<ArrowRight
					size={14}
					strokeWidth={2}
					className='absolute inset-0 transition-transform duration-300 ease-out group-hover:translate-x-1'
				/>
			</span>
		</Link>
	);
};
