'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/src/shared/lib';
import { EmojiList } from './emoji-list';
import { useEmojiAnimation } from '../model/use-emoji-animation';

interface Props {
	className?: string;
	onSelect?: (emoji: string) => void;
	selectedEmoji?: string;
}

export const EmojiPicker = ({ className, onSelect, selectedEmoji }: Props) => {
	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const [animate, setAnimate] = useState(false);
	const [search, setSearch] = useState('');

	const pickerRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const { displayedEmoji, phase } = useEmojiAnimation(selectedEmoji);

	const close = useCallback(() => {
		setAnimate(false);

		if (closeTimer.current) {
			clearTimeout(closeTimer.current);
		}

		closeTimer.current = setTimeout(() => {
			setIsPickerOpen(false);
			closeTimer.current = null;
		}, 150);
	}, []);

	const open = useCallback(() => {
		if (closeTimer.current) {
			clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}

		setAnimate(false);
		setIsPickerOpen(true);
	}, []);

	const togglePicker = () => {
		if (isPickerOpen) {
			close();
		} else {
			open();
		}
	};

	useEffect(() => {
		if (!isPickerOpen) return;

		const frame = requestAnimationFrame(() => setAnimate(true));

		return () => cancelAnimationFrame(frame);
	}, [isPickerOpen]);

	useEffect(() => {
		if (!isPickerOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;

			if (
				pickerRef.current?.contains(target) ||
				buttonRef.current?.contains(target)
			) {
				return;
			}

			close();
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isPickerOpen, close]);

	useEffect(
		() => () => {
			if (closeTimer.current) {
				clearTimeout(closeTimer.current);
			}
		},
		[],
	);

	const handleSelect = (emoji: string) => {
		onSelect?.(emoji);
		close();
	};

	return (
		<div
			className={cn('relative flex flex-col items-center w-full', className)}
		>
			<button
				className='size-20 text-[34px] flex-shrink-0 bg-[var(--muted)] border-[0.5px] border-transparent active:border-[var(--border-primary)] rounded-full cursor-pointer active:scale-95 transition ease-linear duration-70'
				type='button'
				onClick={togglePicker}
				ref={buttonRef}
			>
				<span
					key={displayedEmoji}
					className='inline-block'
					style={{
						animation:
							phase === 'exit'
								? 'emoji-exit 100ms ease-in forwards'
								: phase === 'enter'
									? 'emoji-enter 100ms ease-out both'
									: 'none',
					}}
				>
					{displayedEmoji}
				</span>
			</button>

			{isPickerOpen && (
				<div
					ref={pickerRef}
					className='flex flex-col absolute top-full mt-2 z-10 w-full min-h-[300px] h-[300px] bg-[var(--muted)] rounded-[8px] shadow-2xl'
					style={{
						opacity: animate ? 1 : 0,
						translate: animate ? '0 0' : '0 -4px',
						transition: 'opacity 150ms ease-out, translate 150ms ease-out',
					}}
				>
					<EmojiList
						search={search}
						onSearchChange={setSearch}
						onSelect={handleSelect}
					/>
				</div>
			)}
		</div>
	);
};
