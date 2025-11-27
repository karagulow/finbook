'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../lib';

interface Props {
	children?: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

export const Sheet: React.FC<Props> = ({ children, isOpen, onClose }) => {
	const [mounted, setMounted] = useState(false);
	const [animate, setAnimate] = useState(false);
	const keydownListenerRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	const close = () => {
		setAnimate(false);
		setTimeout(onClose, 300);
		document.body.style.overflow = '';
	};

	useEffect(() => {
		if (!mounted) return;

		if (isOpen) {
			setAnimate(true);
			document.body.style.overflow = 'hidden';

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
			};
		}
	}, [mounted, isOpen]);

	if (!mounted) return null;

	return createPortal(
		<>
			{isOpen && (
				<>
					<div
						className={cn(
							'fixed inset-0 bg-black/50 backdrop-blur-[2px] z-10 transition-opacity duration-300',
							animate ? 'opacity-100' : 'opacity-0'
						)}
						onClick={close}
					></div>

					<div
						className={cn(
							'fixed inset-y-0 right-0 z-11 flex flex-row items-start m-5 transform transition-transform duration-300',
							animate ? 'translate-x-0' : 'translate-x-full'
						)}
						onClick={e => e.stopPropagation()}
					>
						<button
							onClick={close}
							className='p-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground-primary)] transition cursor-pointer'
						>
							<X strokeWidth={1.5} size={30} />
						</button>

						<div className='w-100 h-[calc(100vh-40px)] rounded-[8px] bg-[var(--card)] p-5 shadow-xl'>
							{children}
						</div>
					</div>
				</>
			)}
		</>,
		document.body
	);
};
