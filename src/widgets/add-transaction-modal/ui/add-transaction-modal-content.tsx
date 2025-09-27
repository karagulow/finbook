import React, { useState } from 'react';

import { Tabs } from '@/src/shared/ui';
import { TransactionForm } from './transaction-form';

interface Props {
	onClose: () => void;
}

export const AddTransactionModalContent: React.FC<Props> = ({ onClose }) => {
	const transactionTypes = ['Доход', 'Расход', 'Перевод'];
	const [activeTransactionType, setActiveTransactionType] = useState(
		transactionTypes[1]
	);

	return (
		<div className='flex flex-col gap-5 h-full'>
			<h2 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
				Добавить транзакцию
			</h2>

			<Tabs
				items={transactionTypes}
				activeItem={activeTransactionType}
				setActiveItem={setActiveTransactionType}
				tabName='transaction-type'
			/>

			<div className='flex-1 min-h-0'>
				{activeTransactionType === transactionTypes[0] && (
					<TransactionForm type='INCOME' onClose={onClose} />
				)}

				{activeTransactionType === transactionTypes[1] && (
					<TransactionForm type='EXPENSE' onClose={onClose} />
				)}
			</div>
		</div>
	);
};
