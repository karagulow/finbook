'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
	children?: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

export const Drawer: React.FC<Props> = ({ children, isOpen, onClose }) => {
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
						className='relative w-full h-[80vh] bottom-[-100px] rounded-t-[12px] bg-[var(--card)] p-5 pb-35 shadow-[0px_0px_10px_rgba(0,0,0,0.25)]'
						initial={{ y: '100%' }}
						animate={{ y: 0 }}
						exit={{ y: '100%' }}
						transition={{ type: 'tween', stiffness: 300, damping: 30 }}
						drag='y'
						dragConstraints={{ top: -10, bottom: 0 }}
						dragElastic={{ top: 0.1, bottom: 0.5 }}
						onDragEnd={(_, info) => {
							if (info.offset.y > 100 || info.velocity.y > 500) {
								onClose();
							}
						}}
						onClick={e => e.stopPropagation()}
					>
						<div className='mx-auto mb-4 h-1.5 w-20 rounded-full bg-[var(--muted)]' />
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
