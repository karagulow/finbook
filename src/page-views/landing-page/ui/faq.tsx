'use client';

import React, { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/src/shared/lib';
import { Container } from '@/src/shared/ui';
import { FAQ_ITEMS } from '../model/faq-items';

export const LandingFaq: React.FC = () => {
	const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

	const toggle = (id: string) => {
		setOpenIds(prev => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	return (
		<section id='faq' className='scroll-mt-20 py-16 sm:py-24'>
			<Container
				width={1280}
				className='grid items-start gap-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16 lg:gap-24'
			>
				<h2 className='font-semibold tracking-[-0.04em] text-[32px] leading-[1.1] sm:text-[44px] text-[var(--foreground-primary)]'>
					Вопросы и ответы
				</h2>

				<div className='[overflow-anchor:none] border-t border-[var(--border-primary)]'>
					{FAQ_ITEMS.map(item => (
						<FaqItem
							key={item.id}
							item={item}
							open={openIds.has(item.id)}
							onToggle={() => toggle(item.id)}
						/>
					))}
				</div>
			</Container>
		</section>
	);
};

interface FaqItemProps {
	item: (typeof FAQ_ITEMS)[number];
	open: boolean;
	onToggle: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ item, open, onToggle }) => {
	const panelId = useId();
	const buttonId = `${panelId}-button`;

	return (
		<div className='border-b border-[var(--border-primary)]'>
			<h3>
				<button
					id={buttonId}
					type='button'
					aria-expanded={open}
					aria-controls={panelId}
					onClick={onToggle}
					className='flex w-full items-center justify-between gap-4 py-5 text-left cursor-pointer'
				>
					<span className='font-semibold text-[15px] sm:text-[16px] leading-snug text-[var(--foreground-primary)]'>
						{item.question}
					</span>
					<ChevronDown
						size={18}
						strokeWidth={1.75}
						aria-hidden
						className={cn(
							'shrink-0 text-[var(--foreground-secondary)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
							open && 'rotate-180',
						)}
					/>
				</button>
			</h3>

			<div
				id={panelId}
				role='region'
				aria-labelledby={buttonId}
				className={cn(
					'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
					open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
				)}
			>
				<div className='min-h-0 overflow-hidden'>
					<p
						className={cn(
							'max-w-[52ch] pb-5 font-medium text-[14px] sm:text-[15px] leading-relaxed text-[var(--foreground-secondary)] transition-opacity duration-200 ease-out',
							open ? 'opacity-100' : 'opacity-0',
						)}
					>
						{item.answer}
					</p>
				</div>
			</div>
		</div>
	);
};
