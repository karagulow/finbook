import React from 'react';

import { Debt, DebtType } from '@/src/entities/debt';
import { useAnimatedNumber } from '@/src/shared/hooks';
import { cn } from '@/src/shared/lib';
import { getDebtDeadlineNote } from '../lib/get-debt-deadline-note';

interface Props {
	debt: Debt;
	currency: string;
	emphasized?: boolean;
	onClick: () => void;
}

const typeLabel: Record<DebtType, string> = {
	OWED_BY_ME: 'Я должен',
	OWED_TO_ME: 'Мне должны',
};

const formatAmount = (value: number) =>
	value.toLocaleString('ru-RU', {
		maximumFractionDigits: 2,
	});

export const DebtOverviewItem: React.FC<Props> = ({
	debt,
	currency,
	emphasized = false,
	onClick,
}) => {
	const remaining = Math.max(0, debt.targetAmount - debt.savedAmount);
	const animatedRemaining = useAnimatedNumber(remaining);
	const progress =
		debt.targetAmount > 0
			? Math.min(100, Math.max(0, (debt.savedAmount / debt.targetAmount) * 100))
			: 0;
	const note = getDebtDeadlineNote(debt.deadline);

	return (
		<button
			type='button'
			onClick={onClick}
			className='flex w-full cursor-pointer flex-col gap-2 rounded-[12px] text-left transition sm:px-2.5 sm:py-2 hover:bg-none sm:hover:bg-[var(--muted)]'
		>
			<div className='flex min-w-0 items-baseline justify-between gap-3'>
				<span className='truncate font-medium text-[15px] text-[var(--foreground-primary)]'>
					{debt.name}
				</span>
				<span className='shrink-0 font-medium text-[15px] text-[var(--foreground-primary)] tabular-nums'>
					{formatAmount(animatedRemaining)} {currency}
				</span>
			</div>

			<span
				className={cn(
					'font-medium',
					note?.urgent || emphasized
						? 'text-[var(--foreground-primary)]'
						: 'text-[var(--foreground-secondary)]',
					emphasized ? 'text-[15px]' : 'text-[13px]',
				)}
			>
				{typeLabel[debt.type]}
				{note ? ` · ${note.text}` : ''}
			</span>

			<div className='h-1 w-full overflow-hidden rounded-full bg-[var(--border-primary-hover)]'>
				<div
					className='h-full rounded-full bg-[var(--foreground-primary)] transition-[width] duration-500 ease-out'
					style={{ width: `${progress}%` }}
				/>
			</div>
		</button>
	);
};
