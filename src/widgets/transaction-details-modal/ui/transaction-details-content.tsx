'use client';

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { Button, Description } from '@/src/shared/ui';
import { Transaction } from '../model/types';
import { TransactionParams } from './transaction-params';
import { TransactionSum } from './transaction-sum';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';

import { toastOptions } from '@/src/shared/lib';
import { EditTransactionModal } from '../../edit-transaction-modal';

interface Props {
	transaction: Transaction;
	onCloseModal: () => void;
}

export const TransactionDetailsContent: React.FC<Props> = ({
	transaction,
	onCloseModal,
}) => {
	const queryClient = useQueryClient();

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
		useState(false);

	const openEditModal = () => setIsEditModalOpen(true);
	const closeEditModal = () => setIsEditModalOpen(false);

	const openConfirmDeleteDialog = () => setIsConfirmDeleteDialogOpen(true);
	const closeConfirmDeleteDialog = () => setIsConfirmDeleteDialogOpen(false);

	const handleDelete = async () => {
		try {
			await axios.delete(`/api/transactions/${transaction.id}`);
			queryClient.invalidateQueries({ queryKey: ['transactions'] });
			setIsConfirmDeleteDialogOpen(false);
			toast.success('Транзакция успешно удалена!', toastOptions);
			onCloseModal();
		} catch (err) {
			console.error('Ошибка удаления транзакции', err);
			toast.error('Ошибка удаления транзакции', toastOptions);
		}
	};

	return (
		<>
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
					<Button className='w-full' variant='default' onClick={openEditModal}>
						Изменить
					</Button>
					<Button
						className='w-full'
						variant='wrong'
						onClick={openConfirmDeleteDialog}
					>
						Удалить
					</Button>
				</div>
			</div>

			<EditTransactionModal
				isOpen={isEditModalOpen}
				onClose={closeEditModal}
				transaction={transaction}
			/>

			<ConfirmDeleteDialog
				isOpen={isConfirmDeleteDialogOpen}
				onClose={closeConfirmDeleteDialog}
				onConfirm={handleDelete}
			/>
		</>
	);
};
