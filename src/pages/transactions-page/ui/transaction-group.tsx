import React from 'react';
import { CircleArrowDown, CircleArrowUp } from 'lucide-react';
import { TransactionItem } from './transaction-item';
import { TransferItem } from './transfer-item';

interface Props {
	data: {
		date: string;
		expense: number;
		income: number;
		transactions: any[];
	};
}

export const TransactionGroup: React.FC<Props> = ({ data }) => {
	return (
		<div className='flex flex-col gap-0.5'>
			<div className='flex flex-col gap-2.5 items-start sm:flex-row sm:justify-between sm:items-center p-[0_10px_10px] border-b-[0.5px] border-[var(--divider)] font-medium text-[13px]'>
				<span className='text-[var(--foreground-secondary)]'>
					{new Date(data.date).toLocaleDateString('ru-RU', {
						day: 'numeric',
						month: 'long',
						year: 'numeric',
					})}
				</span>

				<div className='flex flex-row flex-wrap items-center gap-2 w-full justify-between sm:w-fit sm:justify-start sm:gap-5'>
					<div className='flex flex-row items-center gap-1 text-[var(--success)]'>
						<CircleArrowUp size={16} />
						<span>
							Доход:{' '}
							{data.income.toLocaleString('ru-RU', {
								minimumFractionDigits: 2,
							})}{' '}
							₽
						</span>
					</div>
					<div className='flex flex-row items-center gap-1 text-[var(--wrong)]'>
						<CircleArrowDown size={16} />
						<span>
							Расход:{' '}
							{data.expense.toLocaleString('ru-RU', {
								minimumFractionDigits: 2,
							})}{' '}
							₽
						</span>
					</div>
				</div>
			</div>

			<ul className='flex flex-col'>
				{data.transactions.map(transaction =>
					transaction.type !== 'TRANSFER' ? (
						<TransactionItem key={transaction.id} transaction={transaction} />
					) : (
						<TransferItem key={transaction.id} transfer={transaction} />
					)
				)}
			</ul>
		</div>
	);
};
