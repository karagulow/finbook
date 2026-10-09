'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useAutofocus } from '../hooks';
import { cn, lockBody, unlockBody } from '../lib';

interface Props {
	children?: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

export const Sheet: React.FC<Props> = ({ children, isOpen, onClose }) => {
	const [mounted, setMounted] = useState(false);
	const [animate, setAnimate] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);
	const keydownListenerRef = useRef<(() => void) | null>(null);

	useAutofocus(mounted && isOpen, panelRef);

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
							'fixed inset-0 bg-black/50 backdrop-blur-[2px] z-10 transition-opacity duration-300',
							animate ? 'opacity-100' : 'opacity-0',
						)}
						onClick={close}
					></div>

					<div
						className={cn(
							'fixed inset-y-0 right-0 z-11 m-5 transform transition-transform duration-300',
							animate ? 'translate-x-0' : 'translate-x-full',
						)}
						onClick={e => e.stopPropagation()}
					>
						<button
							onClick={close}
							className='absolute right-5 top-5 p-1 text-[var(--foreground-secondary)] hover:text-[var(--foreground-primary)] transition cursor-pointer'
						>
							<X strokeWidth={2} size={20} />
						</button>

						<div
							ref={panelRef}
							className='flex h-[calc(100vh-40px)] w-100 flex-col overflow-hidden rounded-[16px] bg-[var(--card)] p-5 shadow-xl'
						>
							{children}
						</div>
					</div>
				</>
			)}
		</>,
		document.body,
	);
};
