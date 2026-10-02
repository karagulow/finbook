import React from 'react';
import { useAnimatedNumber } from '@/src/shared/hooks';
import { Transaction } from '../model/types';
import { cn } from '@/src/shared/lib';

interface Props {
	transaction: Transaction;
}

export const TransactionSum: React.FC<Props> = ({ transaction }) => {
	const sign =
		transaction.type === 'INCOME'
			? '+'
			: transaction.type === 'EXPENSE'
			? '-'
			: '';
	const animatedAmount = useAnimatedNumber(transaction.amount ?? 0);
	const animatedAmountFrom = useAnimatedNumber(transaction.amountFrom ?? 0);
	const animatedAmountTo = useAnimatedNumber(transaction.amountTo ?? 0);

	return transaction.type === 'TRANSFER' ? (
		<div className='font-medium text-[22px] text-[var(--foreground-primary)] tabular-nums'>
			<span>
				{animatedAmountFrom.toLocaleString('ru-RU', {
					minimumFractionDigits: 2,
				})}{' '}
				{transaction.accountFrom?.currency.symbol ||
					transaction.accountFrom?.currency.code}
			</span>{' '}
			{transaction.accountFrom?.currency.id !==
				transaction.accountTo?.currency.id && (
				<>
					→{' '}
					<span>
						{animatedAmountTo.toLocaleString('ru-RU', {
							minimumFractionDigits: 2,
						})}{' '}
						{transaction.accountTo?.currency.symbol ||
							transaction.accountTo?.currency.code}
					</span>
				</>
			)}
		</div>
	) : (
		<span
			className={cn(`font-medium text-[22px] tabular-nums`, {
				'text-[var(--success)]': sign === '+',
				'text-[var(--wrong)]': sign === '-',
			})}
		>
			{sign}{' '}
			{animatedAmount.toLocaleString('ru-RU', {
				minimumFractionDigits: 2,
			})}{' '}
			{transaction.account?.currency.symbol ||
				transaction.account?.currency.code}
		</span>
	);
};
