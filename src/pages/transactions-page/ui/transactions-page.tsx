import React from 'react';

import { StickyHeader } from '@/src/shared/ui';
import { TransactionList } from './transaction-list';
import { AddTransaction } from '@/src/features/add-transaction';

export const TransactionsPage: React.FC = () => {
	return (
		<>
			<StickyHeader title='Транзакции' />

			<div className='flex flex-col gap-5 sm:gap-[30px]'>
				<div className='flex flex-col items-start gap-2.5 sm:flex-row sm:justify-between sm:items-center'>
					<h1 className='font-medium text-[24px] text-[var(--foreground-primary)]'>
						Транзакции
					</h1>

					<AddTransaction />
				</div>

				<TransactionList />
			</div>
		</>
	);
};
