'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn, lockBody, unlockBody } from '../lib';

interface Props {
	children?: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

export const Drawer: React.FC<Props> = ({ children, isOpen, onClose }) => {
	const [mounted, setMounted] = useState(false);
	const [animate, setAnimate] = useState(false);

	const [dragVersion, bumpDragVersion] = useState(0);
	const dragStartY = useRef<number | null>(null);
	const dragOffset = useRef(0);
	const [, forceUpdate] = useState(0);
	const animationFrameRef = useRef<number | null>(null);

	const keydownListenerRef = useRef<(() => void) | null>(null);
	const drawerRef = useRef<HTMLDivElement>(null);

	const MAX_UPWARD_OFFSET = 20;
	const CLOSE_THRESHOLD = 120;
	const UPWARD_RESISTANCE = 0.3;

	useEffect(() => {
		setMounted(true);
	}, []);

	const close = useCallback(() => {
		setAnimate(false);
		dragOffset.current = 0;
		forceUpdate(n => n + 1);
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
		if (!isOpen) return;

		const handlePointerMove = (e: PointerEvent) => {
			if (dragStartY.current === null) return;

			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}

			animationFrameRef.current = requestAnimationFrame(() => {
				const rawOffset = e.clientY - dragStartY.current!;
				let processedOffset = rawOffset;

				if (rawOffset < 0) {
					processedOffset = rawOffset * UPWARD_RESISTANCE;
				} else {
					processedOffset = rawOffset;
				}

				if (processedOffset > -MAX_UPWARD_OFFSET) {
					dragOffset.current = processedOffset;
					forceUpdate(n => n + 1);
				}
			});
		};

		const handlePointerUp = () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}

			if (dragOffset.current > CLOSE_THRESHOLD) {
				close();
			} else {
				dragOffset.current = 0;
				forceUpdate(n => n + 1);
			}
			dragStartY.current = null;
		};

		if (dragStartY.current !== null) {
			document.addEventListener('pointermove', handlePointerMove, {
				passive: true,
			});
			document.addEventListener('pointerup', handlePointerUp);
			document.body.style.userSelect = 'none';
			document.body.style.touchAction = 'none';
		}

		return () => {
			document.removeEventListener('pointermove', handlePointerMove);
			document.removeEventListener('pointerup', handlePointerUp);
			document.body.style.userSelect = '';
			document.body.style.touchAction = '';

			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [dragVersion, close, isOpen]);

	const onHandleDown = (e: React.PointerEvent) => {
		dragStartY.current = e.clientY;
		dragOffset.current = 0;
		bumpDragVersion(n => n + 1);
	};

	if (!mounted) return null;

	return createPortal(
		<>
			{isOpen && (
				<div className='fixed inset-0 z-10 flex items-end' onClick={close}>
					<div
						className={cn(
							'absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300',
							animate ? 'opacity-100' : 'opacity-0'
						)}
					/>

					<div
						ref={drawerRef}
						className={cn(
							'relative w-full h-[80vh] rounded-t-[12px] bg-[var(--card)] p-5 pb-[calc(env(safe-area-inset-bottom)+20px)] shadow-xl flex flex-col',
							dragStartY.current === null && 'transition-transform duration-300'
						)}
						style={{
							transform: animate
								? `translateY(${dragOffset.current}px)`
								: 'translateY(100%)',
						}}
						onClick={e => e.stopPropagation()}
					>
						<div
							className='mx-auto mb-4 w-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none'
							onPointerDown={onHandleDown}
						>
							<div className='h-1.5 w-20 rounded-full bg-[var(--muted)]' />
						</div>

						<div className='flex-1 overflow-y-auto'>{children}</div>

						<div className='fixed left-[-20px] bottom-[-40px] w-[calc(100%+20px)] h-10 bg-[var(--card)]'></div>
					</div>
				</div>
			)}
		</>,
		document.body
	);
};
