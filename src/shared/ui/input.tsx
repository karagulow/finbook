'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '../lib';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, Props>(
	({ label, error, ...rest }, ref) => {
		const [showError, setShowError] = useState(false);

		useEffect(() => {
			if (error) {
				setShowError(true);
			} else {
				const timeout = setTimeout(() => setShowError(false), 200);
				return () => clearTimeout(timeout);
			}
		}, [error]);

		return (
			<label className='flex flex-col gap-1.5'>
				{label && (
					<span className='font-medium text-[13px] text-[var(--foreground-secondary)] cursor-pointer'>
						{label}
					</span>
				)}

				<input
					ref={ref}
					className={cn(
						'h-11.5 rounded-[6px] bg-[var(--input-primary)] border-[0.5px] border-[var(--border-primary)] px-3 font-regular text-[13px] text-[var(--foreground-primary)] placeholder:text-[var(--input-primary-placeholder)] outline-none focus:border-[var(--border-primary-hover)] hover:border-[var(--border-primary-hover)] transition',
						rest.type === 'color' && 'w-full p-2 cursor-pointer'
					)}
					{...rest}
				/>

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
	}
);

Input.displayName = 'Input';
