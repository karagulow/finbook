'use client';

import React from 'react';
import { useAnimatedNumber } from '@/src/shared/hooks';
import { useBalance } from '../hooks/use-balance';

export const Balance: React.FC = () => {
	const { total, currencyCode, currencySymbol } = useBalance();
	const animatedTotal = useAnimatedNumber(total);

	return (
		<div className='font-medium text-[24px] text-[var(--foreground-secondary)]'>
			Баланс:{' '}
			<span className='text-[var(--foreground-primary)] tabular-nums'>
				{animatedTotal.toLocaleString('ru-RU', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}{' '}
				{currencySymbol || currencyCode}
			</span>
		</div>
	);
};
