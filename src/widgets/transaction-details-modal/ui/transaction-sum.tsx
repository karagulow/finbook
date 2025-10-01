import React from 'react';
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

	return transaction.type === 'TRANSFER' ? (
		<div className='font-medium text-[22px] text-[var(--foreground-primary)]'>
			<span>
				{transaction.amountFrom?.toLocaleString('ru-RU', {
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
						{transaction.amountTo?.toLocaleString('ru-RU', {
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
			className={cn(`font-medium text-[22px]`, {
				'text-[var(--success)]': sign === '+',
				'text-[var(--wrong)]': sign === '-',
			})}
		>
			{sign}{' '}
			{transaction.amount?.toLocaleString('ru-RU', {
				minimumFractionDigits: 2,
			})}{' '}
			{transaction.account?.currency.symbol ||
				transaction.account?.currency.code}
		</span>
	);
};
