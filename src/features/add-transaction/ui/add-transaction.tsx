'use client';

import React, { useState } from 'react';

import { Button } from '@/src/shared/ui';
import { AddTransactionModal } from '@/src/widgets/add-transaction-modal';

export const AddTransaction: React.FC = () => {
	const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
		useState(false);

	const openAddTransactionModal = () => setIsAddTransactionModalOpen(true);
	const closeAddTransactionModal = () => setIsAddTransactionModalOpen(false);

	return (
		<>
			<Button className='w-full sm:w-auto' onClick={openAddTransactionModal}>
				Добавить транзакцию
			</Button>

			<AddTransactionModal
				isOpen={isAddTransactionModalOpen}
				onClose={closeAddTransactionModal}
			/>
		</>
	);
};
