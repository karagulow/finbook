'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface Props {
	children?: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

export const Sheet: React.FC<Props> = ({ children, isOpen, onClose }) => {
	const [mounted, setMounted] = useState(false);
	const keydownListenerRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		if (isOpen) {
			document.body.style.overflow = 'hidden';

			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					onClose();
				}
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
	}, [mounted, isOpen, onClose]);

	if (!mounted) return null;

	return createPortal(
		<AnimatePresence
			onExitComplete={() => {
				document.body.style.overflow = '';
			}}
		>
			{isOpen && (
				<motion.div
					key='sheet'
					className='fixed inset-0 flex items-start justify-end p-5 bg-black/50 backdrop-blur-[2px] z-10'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3, ease: 'easeInOut' }}
					onClick={onClose}
				>
					<motion.div
						className='relative flex flex-row items-start'
						initial={{ x: '110%' }}
						animate={{ x: 0 }}
						exit={{ x: '110%' }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						onClick={e => e.stopPropagation()}
					>
						<button
							onClick={onClose}
							className='p-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground-primary)] transition cursor-pointer'
						>
							<X strokeWidth={1.5} size={30} />
						</button>

						<div className='sheet-panel w-100 h-[calc(100vh-40px)] rounded-[8px] bg-[var(--card)] p-5 shadow-xl'>
							{children}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.body
	);
};
