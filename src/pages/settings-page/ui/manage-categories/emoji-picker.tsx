import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import i18n from '@emoji-mart/data/i18n/ru.json';

import { cn } from '@/src/shared/lib';

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
	const pickerRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const togglePicker = () => {
		setIsPickerOpen(!isPickerOpen);
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

			<AnimatePresence>
				{isPickerOpen && (
					<motion.div
						className='absolute top-full mt-2 z-10'
						ref={pickerRef}
						initial={{ opacity: 0, y: -4 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -4 }}
						transition={{ duration: 0.15 }}
					>
						<Picker
							data={data}
							set='native'
							theme='auto'
							icons='auto'
							i18n={i18n}
							autoFocus={false}
							navPosition='bottom'
							previewPosition='none'
							skinTonePosition='none'
							onEmojiSelect={(e: any) => {
								onSelect?.(e.native);
								setIsPickerOpen(false);
							}}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
