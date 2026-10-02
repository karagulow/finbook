import React from 'react';
import Image from 'next/image';
import { cn } from '../lib';

interface Props {
	src: string;
	alt: string;
	size?: number;
	className?: string;
	priority?: boolean;
}

export const AppIcon: React.FC<Props> = ({
	src,
	alt,
	size = 32,
	className,
	priority,
}) => {
	return (
		<span
			className={cn(
				'relative inline-flex shrink-0 overflow-hidden bg-black rounded-[8px]',
				className,
			)}
			style={{ width: size, height: size }}
		>
			<Image
				src={src}
				alt={alt}
				width={size}
				height={size}
				priority={priority}
				className='size-full object-cover'
			/>
			<span
				aria-hidden
				className='pointer-events-none absolute inset-0 [border-radius:inherit] [corner-shape:inherit] shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_-0.5px_0.75px_rgba(0,0,0,0.22)] ring-1 ring-black/25'
			/>
			<span
				aria-hidden
				className='pointer-events-none absolute inset-x-[10%] top-0 h-[42%] rounded-[100%] bg-gradient-to-b from-white/10 to-transparent opacity-70 blur-[1px]'
			/>
			<span
				aria-hidden
				className='pointer-events-none absolute inset-0 [border-radius:inherit] [corner-shape:inherit] bg-gradient-to-b from-white/14 via-transparent to-black/20'
			/>
		</span>
	);
};
