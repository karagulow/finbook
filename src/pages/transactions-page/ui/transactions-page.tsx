'use client';

import React, { useState } from 'react';

import { Button } from '@/src/shared/ui';
import { AddTransactionModal } from '@/src/widgets/add-transaction-modal';
import { TransactionList } from './transaction-list';

export const TransactionsPage: React.FC = () => {
	const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
		useState(false);

	const openAddTransactionModal = () => setIsAddTransactionModalOpen(true);
	const closeAddTransactionModal = () => setIsAddTransactionModalOpen(false);

	return (
		<>
			<div className='flex flex-col gap-5 sm:gap-[30px]'>
				<div className='flex flex-col items-start gap-2.5 sm:flex-row sm:justify-between sm:items-center'>
					<h1 className='font-medium text-[24px] text-[var(--foreground-primary)]'>
						Транзакции
					</h1>
					<Button
						className='w-full sm:w-auto'
						onClick={openAddTransactionModal}
					>
						Добавить транзакцию
					</Button>
				</div>

				<TransactionList />
			</div>

			<AddTransactionModal
				isOpen={isAddTransactionModalOpen}
				onClose={closeAddTransactionModal}
			/>
		</>
	);
};
