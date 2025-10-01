import React from 'react';

import { Transaction } from '../model/types';
import { TransactionForm } from './transaction-form';
import { TransferForm } from './transfer-form';

interface Props {
	transaction: Transaction;
	onClose: () => void;
}

export const EditTransactionContent: React.FC<Props> = ({
	transaction,
	onClose,
}) => {
	return (
		<div className='flex flex-col gap-5 h-full'>
			<h2 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
				Изменить транзакцию
			</h2>

			<div className='flex-1 min-h-0'>
				{transaction.type === 'INCOME' && (
					<TransactionForm
						type='INCOME'
						onClose={onClose}
						transaction={transaction}
					/>
				)}
				{transaction.type === 'EXPENSE' && (
					<TransactionForm
						type='EXPENSE'
						onClose={onClose}
						transaction={transaction}
					/>
				)}
				{transaction.type === 'TRANSFER' && (
					<TransferForm onClose={onClose} transaction={transaction} />
				)}
			</div>
		</div>
	);
};
