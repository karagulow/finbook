'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../lib';

export type Option<T extends string | number = string> = {
	value: T;
	label: string;
	disabled?: boolean;
};

type Props<T extends string | number = string> = {
	options: Option<T>[];
	value?: T | null;
	onChange?: (value: T) => void;
	placeholder?: string;
	label?: string;
	error?: string;
	className?: string;
	fieldClassName?: string;
};

export function Select<T extends string | number = string>({
	options,
	value,
	onChange,
	placeholder = 'Select…',
	label,
	error,
	className,
	fieldClassName,
}: Props<T>) {
	const [open, setOpen] = useState(false);
	const [animate, setAnimate] = useState(false);
	const [highlighted, setHighlighted] = useState<number>(-1);
	const [showError, setShowError] = useState(false);

	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

	const selected = options.find(o => o.value === value);

	useEffect(() => {
		if (error) {
			setShowError(true);
		} else {
			const timeout = setTimeout(() => setShowError(false), 200);
			return () => clearTimeout(timeout);
		}
	}, [error]);

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(e.target as Node)
			) {
				setOpen(false);
				setTimeout(() => setAnimate(false), 150);
			}
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, []);

	useEffect(() => {
		function handleKey(e: KeyboardEvent) {
			if (!open) return;

			if (e.key === 'Escape') {
				setOpen(false);
				setTimeout(() => setAnimate(false), 150);
				return;
			}

			if (e.key === 'Tab') {
				setOpen(false);
				setTimeout(() => setAnimate(false), 150);
				setHighlighted(-1);
				return;
			}

			if (e.key === 'ArrowDown') {
				e.preventDefault();
				setHighlighted(prev => {
					const next = prev + 1;
					for (let i = 0; i < options.length; i++) {
						const idx = (next + i) % options.length;
						if (!options[idx].disabled) {
							optionRefs.current[idx]?.scrollIntoView({ block: 'nearest' });
							return idx;
						}
					}
					return prev;
				});
			}

			if (e.key === 'ArrowUp') {
				e.preventDefault();
				setHighlighted(prev => {
					const next = prev - 1;
					for (let i = 0; i < options.length; i++) {
						const idx = (next - i + options.length) % options.length;
						if (!options[idx].disabled) {
							optionRefs.current[idx]?.scrollIntoView({ block: 'nearest' });
							return idx;
						}
					}
					return prev;
				});
			}

			if (e.key === 'Enter' && highlighted >= 0) {
				e.preventDefault();
				const opt = options[highlighted];
				if (!opt.disabled) {
					onChange?.(opt.value);
					setOpen(false);
					setTimeout(() => setAnimate(false), 150);
				}
			}
		}

		document.addEventListener('keydown', handleKey);
		return () => document.removeEventListener('keydown', handleKey);
	}, [open, highlighted, options, onChange]);

	useEffect(() => {
		if (open) {
			const selectedIndex = options.findIndex(o => o.value === value);
			setHighlighted(selectedIndex);
			if (optionRefs.current[selectedIndex]) {
				optionRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' });
			}
		} else {
			setHighlighted(-1);
		}
	}, [open, value, options]);

	const openDropdown = () => {
		if (!open) {
			setAnimate(true);
			requestAnimationFrame(() => setOpen(true));
		} else {
			setOpen(false);
			setTimeout(() => setAnimate(false), 150);
		}
	};

	const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
		if (open) return;

		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			openDropdown();
		}

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			openDropdown();
		}
	};

	return (
		<label className={cn('flex flex-col gap-1.5', className)}>
			{label && (
				<span className='font-medium text-[13px] text-[var(--foreground-secondary)] cursor-pointer'>
					{label}
				</span>
			)}

			<div ref={wrapperRef} className='relative'>
				<div
					role='button'
					tabIndex={0}
					onClick={openDropdown}
					onKeyDown={handleTriggerKeyDown}
					className={cn(
						'h-11.5 w-full flex items-center justify-between rounded-[6px] border-[0.5px] bg-[var(--input-primary)] px-3 text-[13px] font-regular text-[var(--foreground-primary)] outline-none focus-visible:border-[var(--border-primary-hover)] transition cursor-pointer',
						fieldClassName,
						open
							? 'border-[var(--border-primary-hover)]'
							: 'border-[var(--border-primary)] hover:border-[var(--border-primary-hover)]',
					)}
				>
					<span
						className={
							selected ? '' : 'text-[var(--input-primary-placeholder)]'
						}
					>
						{selected ? selected.label : placeholder}
					</span>

					<div
						className={cn(
							'flex items-center justify-center transition',
							open && 'rotate-180',
						)}
					>
						<ChevronDown size={16} className='opacity-70' />
					</div>
				</div>

				{animate && (
					<ul
						className={cn(
							'absolute left-0 top-full mt-1 flex flex-col gap-1 p-1 max-h-60 w-full overflow-auto rounded-[6px] border-[0.5px] border-[var(--border-primary)] bg-[var(--muted)] shadow-lg z-50 transition-all duration-150',
							open
								? 'opacity-100 translate-y-0 pointer-events-auto'
								: 'opacity-0 -translate-y-1 pointer-events-none',
						)}
					>
						{options.map((opt, idx) => {
							const active = value === opt.value;
							const isHighlighted = highlighted === idx;

							return (
								<li
									key={String(opt.value)}
									ref={el => {
										optionRefs.current[idx] = el;
									}}
									onClick={() => {
										if (opt.disabled) return;
										onChange?.(opt.value);
										setOpen(false);
										setTimeout(() => setAnimate(false), 150);
									}}
									className={cn(
										'flex cursor-pointer items-center justify-between px-2 py-2 text-[13px] text-[var(--foreground-primary)] rounded-[4px]',
										opt.disabled
											? 'opacity-50 cursor-not-allowed'
											: isHighlighted
												? 'bg-[var(--button-tertiary-hover)]'
												: 'hover:bg-[var(--button-tertiary-hover)]',
									)}
								>
									{opt.label}
									{active && <Check size={16} />}
								</li>
							);
						})}
					</ul>
				)}
			</div>

			<div
				className={cn(
					'flex transition-all duration-200 overflow-hidden cursor-pointer',
					error ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0',
				)}
			>
				{showError && (
					<span className='font-semibold text-[11px] text-[var(--wrong)]'>
						{error}
					</span>
				)}
			</div>
		</label>
	);
}
