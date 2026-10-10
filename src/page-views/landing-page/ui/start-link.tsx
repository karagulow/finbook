import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Props {
	className?: string;
}

const Arrow = () => (
	<span className='relative inline-flex size-3.5'>
		<ArrowRight
			size={14}
			strokeWidth={2}
			className='absolute inset-0 transition-transform duration-300 ease-out group-hover:translate-x-1'
		/>
	</span>
);

export const LandingStartLink: React.FC<Props> = ({ className }) => {
	return (
		<>
			<Link href='/home' className={`session-only ${className ?? ''}`}>
				Личный кабинет
				<Arrow />
			</Link>
			<Link href='/registration' className={`guest-only ${className ?? ''}`}>
				Начать бесплатно
				<Arrow />
			</Link>
		</>
	);
};
