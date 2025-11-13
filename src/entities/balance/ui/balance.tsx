'use client';

import React from 'react';
import { useBalance } from '../hooks/use-balance';

export const Balance: React.FC = () => {
	const { total, currencyCode, currencySymbol } = useBalance();

	return (
		<div className='font-medium text-[24px] text-[var(--foreground-secondary)]'>
			Баланс:{' '}
			<span className='text-[var(--foreground-primary)]'>
				{total.toLocaleString('ru-RU', { minimumFractionDigits: 2 })}{' '}
				{currencySymbol || currencyCode}
			</span>
		</div>
	);
};
