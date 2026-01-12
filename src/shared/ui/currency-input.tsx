'use client';

import React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { Input } from './input';

interface CurrencyInputProps
	extends Omit<NumericFormatProps, 'customInput' | 'onValueChange'> {
	label?: string;
	error?: string;
	prefix?: string;
	onValueChange?: (value: string) => void;
}

export const CurrencyInput = React.forwardRef<
	HTMLInputElement,
	CurrencyInputProps
>(({ label, error, prefix, onValueChange, ...props }, ref) => {
	return (
		<NumericFormat
			{...props}
			getInputRef={ref}
			customInput={Input}
			label={label}
			error={error}
			prefix={prefix}
			thousandSeparator=' '
			decimalSeparator=','
			decimalScale={2}
			allowNegative={false}
			inputMode='decimal'
			onValueChange={values => {
				onValueChange?.(values.value);
			}}
		/>
	);
});

CurrencyInput.displayName = 'CurrencyInput';
