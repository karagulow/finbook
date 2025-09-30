import React from 'react';
import { Transaction } from '../model/types';

interface Props {
	transaction: Transaction;
}

const formatDate = (isoDate: string) => {
	const date = new Date(isoDate);
	return new Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
};

export const TransactionParams: React.FC<Props> = ({ transaction }) => {
	const isTransfer = transaction.type === 'TRANSFER';

	return (
		<ul className='flex flex-col gap-2.5'>
			{isTransfer ? (
				<>
					<TransactionParamsItem
						label='Категория'
						value='🔄 Перевод между счетами'
					/>
					<TransactionParamsItem
						label='Откуда'
						value={transaction.accountFrom?.name || ''}
					/>
					<TransactionParamsItem
						label='Куда'
						value={transaction.accountTo?.name || ''}
					/>
					<TransactionParamsItem
						label='Дата'
						value={formatDate(transaction.date)}
					/>
				</>
			) : (
				<>
					<TransactionParamsItem
						label='Категория'
						value={`${transaction.category?.icon || ''} ${
							transaction.category?.name || ''
						}`.trim()}
					/>
					<TransactionParamsItem
						label='Подкатегория'
						value={transaction.subcategory?.name || ''}
					/>
					<TransactionParamsItem
						label='Счет'
						value={transaction.account?.name || ''}
					/>
					<TransactionParamsItem
						label='Дата'
						value={formatDate(transaction.date)}
					/>
				</>
			)}
		</ul>
	);
};

const TransactionParamsItem: React.FC<{ label: string; value: string }> = ({
	label,
	value,
}) => (
	<li className='flex flex-row justify-between items-center gap-2 font-medium text-[15px]'>
		<span className='text-[var(--foreground-secondary)] flex-shrink-0'>
			{label}
		</span>
		<span className='text-[var(--foreground-primary)] flex-shrink-0'>
			{value}
		</span>
	</li>
);
