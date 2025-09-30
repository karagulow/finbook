import React from 'react';

import { Button, Description } from '@/src/shared/ui';
import { Transaction } from '../model/types';
import { TransactionParams } from './transaction-params';
import { TransactionSum } from './transaction-sum';

interface Props {
	transaction: Transaction;
}

export const TransactionDetailsContent: React.FC<Props> = ({ transaction }) => {
	return (
		<div className='flex h-full flex-col'>
			<h2 className='mb-5 font-bold text-[17px] text-[var(--foreground-primary)]'>
				Детали транзакции
			</h2>

			<div className='flex flex-col gap-5 flex-1 overflow-y-auto'>
				<TransactionSum transaction={transaction} />
				<TransactionParams transaction={transaction} />
				<Description label='Описание' text={transaction.description} />
			</div>

			<div className='flex flex-row items-center gap-2.5'>
				<Button className='w-full' variant='default'>
					Изменить
				</Button>
				<Button className='w-full' variant='wrong'>
					Удалить
				</Button>
			</div>
		</div>
	);
};
