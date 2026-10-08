'use client';

import React, { useEffect, useRef } from 'react';

import { cn } from '@/src/shared/lib';
import { PIN_LENGTH } from '@/src/shared/lib/pin-constants';

interface PinPadProps {
	value: string;
	onChange: (value: string) => void;
	onComplete: (value: string) => void;
	disabled?: boolean;
	error?: string;
}

export const PinPad: React.FC<PinPadProps> = ({
	value,
	onChange,
	onComplete,
	disabled = false,
	error,
}) => {
	const inputs = useRef<Array<HTMLInputElement | null>>([]);
	const previousValue = useRef(value);

	useEffect(() => {
		inputs.current[0]?.focus();
	}, []);

	useEffect(() => {
		if (previousValue.current !== '' && value === '' && !disabled) {
			inputs.current[0]?.focus();
		}

		previousValue.current = value;
	}, [disabled, value]);

	const commit = (index: number, raw: string) => {
		if (disabled) {
			return;
		}

		const digits = raw.replace(/\D/g, '');

		if (!digits) {
			return;
		}

		const chars = Array.from(
			{ length: PIN_LENGTH },
			(_, item) => value[item] ?? '',
		);

		for (
			let offset = 0;
			offset < digits.length && index + offset < PIN_LENGTH;
			offset++
		) {
			chars[index + offset] = digits[offset];
		}

		let next = '';

		for (const char of chars) {
			if (!char) {
				break;
			}

			next += char;
		}

		onChange(next);

		if (next.length === PIN_LENGTH) {
			onComplete(next);
			return;
		}

		inputs.current[next.length]?.focus();
	};

	const erase = (index: number) => {
		if (disabled || value.length === 0) {
			return;
		}

		const hasDigit = Boolean(value[index]);
		const cutIndex = hasDigit ? index : Math.max(index - 1, 0);
		const next = value.slice(0, cutIndex);

		onChange(next);
		inputs.current[cutIndex]?.focus();
	};

	return (
		<div className='flex flex-col items-center gap-3 w-full'>
			<div
				className='flex gap-2'
				onPaste={event => {
					event.preventDefault();
					commit(0, event.clipboardData.getData('text'));
				}}
			>
				{Array.from({ length: PIN_LENGTH }).map((_, index) => (
					<div key={index} className='relative size-12'>
						<input
							ref={element => {
								inputs.current[index] = element;
							}}
							value={value[index] ? '*' : ''}
							disabled={disabled}
							inputMode='numeric'
							autoComplete={index === 0 ? 'one-time-code' : 'off'}
							autoCapitalize='off'
							spellCheck={false}
							aria-label={`Цифра ${index + 1} из ${PIN_LENGTH}`}
							className={cn(
								'size-12 rounded-[8px] border-[0.5px] bg-[var(--input-primary)] text-center text-[22px] leading-[48px] text-transparent caret-[var(--foreground-primary)] outline-none transition focus:border-[var(--border-primary-hover)] disabled:opacity-40',
								error
									? 'border-[var(--wrong)]'
									: 'border-[var(--border-primary)]',
							)}
							onChange={event => {
								if (!event.target.value) {
									erase(index);
									return;
								}

								commit(index, event.target.value);
							}}
							onKeyDown={event => {
								if (event.key === 'Backspace') {
									event.preventDefault();
									erase(index);
								}

								if (event.key === 'ArrowLeft' && index > 0) {
									inputs.current[index - 1]?.focus();
								}

								if (event.key === 'ArrowRight' && index < PIN_LENGTH - 1) {
									inputs.current[index + 1]?.focus();
								}
							}}
							onFocus={event => event.target.select()}
						/>
						{value[index] && (
							<span className='pointer-events-none absolute inset-0 flex items-center justify-center text-[var(--foreground-primary)]'>
								<svg viewBox='0 0 24 24' className='size-3' aria-hidden>
									<g
										fill='none'
										stroke='currentColor'
										strokeWidth='2.4'
										strokeLinecap='round'
									>
										<line x1='12' y1='2.5' x2='12' y2='21.5' />
										<line x1='3.8' y1='7.2' x2='20.2' y2='16.8' />
										<line x1='3.8' y1='16.8' x2='20.2' y2='7.2' />
									</g>
								</svg>
							</span>
						)}
					</div>
				))}
			</div>
			<p className='min-h-4 text-center text-[12px] font-semibold text-[var(--wrong)]'>
				{error}
			</p>
		</div>
	);
};
