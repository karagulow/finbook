'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
	children?: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

export const Drawer: React.FC<Props> = ({ children, isOpen, onClose }) => {
	const [dragEnabled, setDragEnabled] = useState(true);
	const keydownListenerRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') onClose();
			};
			document.addEventListener('keydown', handleKeyDown);
			keydownListenerRef.current = () =>
				document.removeEventListener('keydown', handleKeyDown);
			return () => {
				if (keydownListenerRef.current) {
					keydownListenerRef.current();
					keydownListenerRef.current = null;
				}
			};
		}
	}, [isOpen, onClose]);

	useEffect(() => {
		const handleDragStart = () => setDragEnabled(false);
		const handleDragEnd = () => setDragEnabled(true);

		// Слушаем кастомные события или используем таймаут
		document.addEventListener('dragstart', handleDragStart);
		document.addEventListener('dragend', handleDragEnd);

		return () => {
			document.removeEventListener('dragstart', handleDragStart);
			document.removeEventListener('dragend', handleDragEnd);
		};
	}, []);

	return (
		<AnimatePresence
			onExitComplete={() => {
				document.body.style.overflow = '';
			}}
		>
			{isOpen && (
				<motion.div
					className='fixed inset-0 z-10 flex items-end'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					onClick={onClose}
				>
					<motion.div
						className='absolute inset-0 bg-black/50 backdrop-blur-[2px]'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					/>

					<motion.div
						className='relative w-full h-[90vh] bottom-[-100px] rounded-t-[12px] bg-[var(--card)] p-5 pb-30 shadow-xl flex flex-col'
						initial={{ y: '100%' }}
						animate={{ y: 0 }}
						exit={{ y: '100%' }}
						transition={{ type: 'tween', stiffness: 300, damping: 30 }}
						drag={dragEnabled ? 'y' : false}
						dragConstraints={{ top: 0, bottom: 0 }}
						dragElastic={0.1}
						onDragEnd={(_, info) => {
							if (info.offset.y > 100 || info.velocity.y > 500) onClose();
						}}
						onClick={e => e.stopPropagation()}
					>
						<div className='mx-auto mb-4 w-full flex items-center justify-center cursor-grab active:cursor-grabbing'>
							<div className='h-1.5 w-20 rounded-full bg-[var(--muted)]' />
						</div>

						<div
							className='flex-1 overflow-y-auto'
							onPointerDown={() => setDragEnabled(false)}
							onPointerUp={() => setDragEnabled(true)}
						>
							{children}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
