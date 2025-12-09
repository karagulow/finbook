'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn, lockBody, unlockBody } from '../lib';

interface Props {
	children?: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

export const Dialog: React.FC<Props> = ({ children, isOpen, onClose }) => {
	const [mounted, setMounted] = useState(false);
	const [animate, setAnimate] = useState(false);
	const keydownListenerRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	const close = useCallback(() => {
		setAnimate(false);
		setTimeout(onClose, 300);
	}, [onClose]);

	useEffect(() => {
		if (!mounted) return;

		if (isOpen) {
			requestAnimationFrame(() => {
				setAnimate(true);
			});
			lockBody();

			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					close();
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
				unlockBody();
			};
		}
	}, [mounted, isOpen, close]);

	if (!mounted) return null;

	return createPortal(
		<>
			{isOpen && (
				<>
					<div
						className={cn(
							'fixed inset-0 z-20 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300',
							animate ? 'opacity-100' : 'opacity-0'
						)}
						onClick={close}
					></div>

					<div
						className={cn(
							'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-21 w-full max-w-lg rounded-[12px] bg-[var(--card)] p-6 shadow-xl transform transition-all duration-300',
							animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
						)}
						onClick={e => e.stopPropagation()}
					>
						{children}
					</div>
				</>
			)}
		</>,
		document.body
	);
};
