'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAutofocus } from '@/src/shared/hooks';
import { cn, lockBody, unlockBody } from '@/src/shared/lib';
import {
	bindDrawerGesture,
	MAX_UPWARD_OFFSET,
	UPWARD_RESISTANCE,
} from '../lib/bind-drawer-gesture';

interface Props {
	children?: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

export const Drawer: React.FC<Props> = ({ children, isOpen, onClose }) => {
	const [mounted, setMounted] = useState(false);
	const [animate, setAnimate] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const dragOffset = useRef(0);
	const [, setTick] = useState(0);
	const suppressClickRef = useRef(false);

	const keydownListenerRef = useRef<(() => void) | null>(null);
	const drawerRef = useRef<HTMLDivElement>(null);
	const closeRef = useRef(onClose);

	useAutofocus(mounted && isOpen, drawerRef);

	useEffect(() => {
		closeRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		setMounted(true);
	}, []);

	const publishOffset = useCallback((sheet: number) => {
		const visual =
			sheet >= 0
				? sheet
				: Math.max(-MAX_UPWARD_OFFSET, sheet * UPWARD_RESISTANCE);
		dragOffset.current = visual;
		setTick(n => n + 1);
	}, []);

	const close = useCallback(() => {
		setAnimate(false);
		setIsDragging(false);
		dragOffset.current = 0;
		setTick(n => n + 1);
		setTimeout(() => closeRef.current(), 300);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		if (isOpen) {
			requestAnimationFrame(() => {
				setAnimate(true);
			});
			lockBody();

			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') close();
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

	useEffect(() => {
		if (!mounted || !isOpen) return;

		const drawer = drawerRef.current;
		if (!drawer) return;

		return bindDrawerGesture(drawer, {
			dragOffset,
			suppressClick: suppressClickRef,
			publishOffset,
			setDragging: setIsDragging,
			close,
		});
	}, [mounted, isOpen, close, publishOffset]);

	const swallowDragClick = (event: React.SyntheticEvent) => {
		if (!suppressClickRef.current) return;
		event.preventDefault();
		event.stopPropagation();
		suppressClickRef.current = false;
	};

	if (!mounted) return null;

	return createPortal(
		<>
			{isOpen && (
				<div
					className='fixed inset-0 z-10 flex items-end'
					onClick={event => {
						if (suppressClickRef.current) {
							swallowDragClick(event);
							return;
						}
						close();
					}}
				>
					<div
						className={cn(
							'absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300',
							animate ? 'opacity-100' : 'opacity-0',
						)}
					/>

					<div
						ref={drawerRef}
						className={cn(
							'relative w-full h-[80vh] rounded-t-[16px] bg-[var(--card)] p-5 pb-[calc(env(safe-area-inset-bottom)+20px)] shadow-xl flex flex-col',
							!isDragging && 'transition-transform duration-300',
							isDragging && 'select-none',
						)}
						style={{
							transform: animate
								? `translateY(${dragOffset.current}px)`
								: 'translateY(100%)',
						}}
						onClick={event => event.stopPropagation()}
						onClickCapture={swallowDragClick}
					>
						<div className='min-h-0 flex-1 overflow-y-auto overscroll-y-none'>
							{children}
						</div>

						<div className='fixed left-[-20px] bottom-[-40px] w-[calc(100%+20px)] h-10 bg-[var(--card)]'></div>
					</div>
				</div>
			)}
		</>,
		document.body,
	);
};
