'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/src/shared/lib';

import emojiData from '@/constants/emoji-data.json';

interface Props {
	className?: string;
	onSelect?: (emoji: string) => void;
	selectedEmoji?: string;
}

export const EmojiPicker: React.FC<Props> = ({
	className,
	onSelect,
	selectedEmoji,
}) => {
	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const [animate, setAnimate] = useState(false);
	const [search, setSearch] = useState('');

	const pickerRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const allEmojis = Object.values(emojiData).flat();
	const filtered = allEmojis.filter(
		e =>
			e.description.toLowerCase().includes(search.toLowerCase()) ||
			e.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
	);

	const togglePicker = () => (isPickerOpen ? close() : open());

	const open = () => {
		setIsPickerOpen(true);
		requestAnimationFrame(() => setAnimate(true));
	};

	const close = () => {
		setAnimate(false);
		setTimeout(() => setIsPickerOpen(false), 150);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				pickerRef.current &&
				!pickerRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setIsPickerOpen(false);
			}
		};

		if (isPickerOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isPickerOpen]);

	return (
		<div
			className={cn('relative flex flex-col items-center w-full', className)}
		>
			<button
				className='size-20 text-[34px] flex-shrink-0 bg-[var(--muted)] border-[0.5px] border-transparent rounded-full cursor-pointer active:scale-97 active:border-[var(--border-primary)] transition ease-in'
				type='button'
				onClick={togglePicker}
				ref={buttonRef}
			>
				{selectedEmoji}
			</button>

			{isPickerOpen && (
				<div
					ref={pickerRef}
					className={cn(
						'flex flex-col absolute top-full mt-2 z-10 w-full min-h-[300px] h-[300px] bg-[var(--muted)] rounded-[8px] shadow-2xl',
						'transition-all duration-150 ease-in-out',
						animate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
					)}
				>
					<input
						className='w-[calc(100%-8px)] m-1 px-2 py-1 rounded-[6px] bg-[var(--card)] outline-none text-[13px] text-[var(--foreground-primary)] placeholder:text-[var(--input-primary-placeholder)]'
						placeholder='Поиск эмодзи'
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>

					{filtered.length > 0 ? (
						<div className='grid grid-cols-10 gap-1 m-1 max-h-full overflow-y-auto overflow-x-hidden'>
							{filtered.map((item, i) => (
								<button
									key={i}
									className='text-2xl text-center aspect-square cursor-pointer active:scale-97 transition duration-100 ease-in'
									onClick={() => {
										onSelect?.(item.emoji);
										setIsPickerOpen(false);
									}}
									type='button'
								>
									{item.emoji}
								</button>
							))}
						</div>
					) : (
						<div className='p-2 text-[13px] text-[var(--foreground-secondary)]'>
							Ничего не найдено
						</div>
					)}
				</div>
			)}
		</div>
	);
};
