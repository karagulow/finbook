'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { cn } from '../lib';
import { ru } from 'date-fns/locale';

interface Props {
	value?: Date | null;
	onChange?: (date: Date) => void;
	placeholder?: string;
	label?: string;
	error?: string;
}

export const DatePicker: React.FC<Props> = ({
	value,
	onChange,
	placeholder = 'Выберите дату',
	label,
	error,
}) => {
	const [open, setOpen] = useState(false);
	const [animate, setAnimate] = useState(false);
	const [showError, setShowError] = useState(false);
	const wrapperRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (error) setShowError(true);
		else {
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
		function handleFocusIn(e: FocusEvent) {
			if (!open) return;

			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(e.target as Node)
			) {
				setOpen(false);
				setTimeout(() => setAnimate(false), 150);
			}
		}

		document.addEventListener('focusin', handleFocusIn);
		return () => document.removeEventListener('focusin', handleFocusIn);
	}, [open]);

	useEffect(() => {
		function handleKey(e: KeyboardEvent) {
			if (!open) return;

			if (e.key === 'Escape') {
				setOpen(false);
				setTimeout(() => setAnimate(false), 150);
				return;
			}
		}

		document.addEventListener('keydown', handleKey);
		return () => document.removeEventListener('keydown', handleKey);
	}, [open]);

	const openPicker = () => {
		if (!open) {
			setAnimate(true);
			requestAnimationFrame(() => setOpen(true));
		} else {
			setOpen(false);
			setTimeout(() => setAnimate(false), 150);
		}
	};

	return (
		<label className='flex flex-col gap-1.5'>
			{label && (
				<span className='font-medium text-[13px] text-[var(--foreground-secondary)] cursor-pointer'>
					{label}
				</span>
			)}

			<div ref={wrapperRef} className='relative'>
				<button
					type='button'
					onClick={openPicker}
					className={cn(
						'h-11.5 w-full flex items-center justify-between rounded-[8px] border-[0.5px] bg-[var(--input-primary)] px-3 text-[13px] font-regular text-[var(--foreground-primary)] outline-none focus-visible:border-[var(--border-primary-hover)] transition cursor-pointer',
						open
							? 'border-[var(--border-primary-hover)]'
							: 'border-[var(--border-primary)] hover:border-[var(--border-primary-hover)]',
					)}
				>
					<span
						className={value ? '' : 'text-[var(--input-primary-placeholder)]'}
					>
						{value ? format(value, 'dd.MM.yyyy') : placeholder}
					</span>

					<Calendar size={16} className='opacity-70' />
				</button>

				{animate && (
					<div
						className={cn(
							'absolute left-0 top-full mt-1 rounded-[6px] border-[0.5px] border-[var(--border-primary)] bg-[var(--muted)] shadow-lg p-2 z-50 transition-all duration-150',
							open
								? 'opacity-100 translate-y-0 pointer-events-auto'
								: 'opacity-0 -translate-y-1 pointer-events-none',
						)}
					>
						<DayPicker
							mode='single'
							selected={value ?? undefined}
							onSelect={date => {
								if (date) {
									onChange?.(date);
									setOpen(false);
									setTimeout(() => setAnimate(false), 150);
									wrapperRef.current
										?.querySelector<HTMLButtonElement>('button[type="button"]')
										?.focus();
								}
							}}
							navLayout='around'
							showOutsideDays
							weekStartsOn={1}
							locale={ru}
							className='!bg-[var(--muted)] text-[13px] text-[var(--foreground-primary)]'
							classNames={{
								day: 'rounded-[4px] transition hover:bg-[var(--button-secondary)]',
							}}
							modifiersClassNames={{
								outside: 'text-[var(--foreground-secondary)] opacity-60',
								selected:
									'bg-[var(--foreground-primary)] font-semibold text-[var(--muted)] rounded-[4px]',
								today:
									'text-[var(--foreground-primary)] bg-[var(--button-secondary)] rounded-[4px]',
							}}
						/>
					</div>
				)}
			</div>

			<div
				className={`flex transition-all duration-200 overflow-hidden cursor-pointer ${
					error ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0'
				}`}
			>
				{showError && (
					<span className='font-semibold text-[11px] text-[var(--wrong)]'>
						{error}
					</span>
				)}
			</div>
		</label>
	);
};
