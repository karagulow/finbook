'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
	children?: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

export const Dialog: React.FC<Props> = ({ children, isOpen, onClose }) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';

			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					onClose();
				}
			};

			document.addEventListener('keydown', handleKeyDown);

			return () => {
				document.body.style.overflow = '';
				document.removeEventListener('keydown', handleKeyDown);
			};
		} else {
			document.body.style.overflow = '';
		}
	}, [isOpen, onClose]);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key='dialog'
					className='fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-[2px]'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.25, ease: 'easeInOut' }}
					onClick={onClose}
				>
					<motion.div
						className='relative w-full max-w-lg rounded-[12px] bg-[var(--card)] p-6 shadow-[0_0_15px_rgba(0,0,0,0.4)]'
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ duration: 0.25, ease: 'easeInOut' }}
						onClick={e => e.stopPropagation()}
					>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
