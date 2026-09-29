import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Debt } from '@/src/entities/debt';

interface Props {
	debt: Debt;
	currency: string;
}

const formatAmount = (value: number) =>
	value.toLocaleString('ru-RU', {
		maximumFractionDigits: 2,
	});

export const DebtCard: React.FC<Props> = ({ debt, currency }) => {
	const progress =
		debt.targetAmount > 0 ? (debt.savedAmount / debt.targetAmount) * 100 : 0;
	const clamped = Math.min(100, Math.max(0, progress));

	return (
		<article className='flex w-full flex-col gap-2 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4'>
			<div className='flex min-w-0 flex-col gap-0.5'>
				<span className='truncate font-medium text-[15px] text-[var(--foreground-primary)]'>
					{debt.name}
				</span>
				<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
					Срок: {format(new Date(debt.deadline), 'd MMMM yyyy', { locale: ru })}
				</span>
			</div>

			<div className='flex flex-col items-end gap-1'>
				<span className='shrink-0 whitespace-nowrap font-medium text-[15px] text-[var(--foreground-primary)]'>
					{formatAmount(debt.savedAmount)}
					<span className='text-[var(--foreground-secondary)]'>
						{' '}
						/ {formatAmount(debt.targetAmount)} {currency}
					</span>
				</span>
				<div className='h-1 w-full overflow-hidden rounded-full bg-[var(--border-primary-hover)]'>
					<div
						className='h-full rounded-full bg-[var(--foreground-primary)]'
						style={{ width: `${clamped}%` }}
					/>
				</div>
			</div>
		</article>
	);
};
