'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { LANDING_SECTIONS } from '@/src/page-views/landing-page/model/sections';
import { queueLandingScroll, scrollToLandingSection } from '../model/scroll-to-section';

type Section = (typeof LANDING_SECTIONS)[number];

interface Props {
	section: Section;
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

export const PublicNavLink: React.FC<Props> = ({
	section,
	className,
	style,
	onClick,
}) => {
	const pathname = usePathname();
	const router = useRouter();

	const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		if (
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey ||
			event.button !== 0
		) {
			onClick?.();
			return;
		}

		event.preventDefault();
		onClick?.();

		if (pathname === '/') {
			scrollToLandingSection(section.id);
			return;
		}

		queueLandingScroll(section.id);
		router.push(`/#${section.id}`, { scroll: false });
	};

	return (
		<Link
			href={`/#${section.id}`}
			className={className}
			style={style}
			onClick={handleClick}
		>
			{section.label}
		</Link>
	);
};
