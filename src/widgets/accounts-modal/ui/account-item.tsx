import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import { DeleteButton, EditButton } from '@/src/shared/ui';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';
import { EditAccountModal } from '../../edit-account-modal';

import { Account } from '../model/types';
import { toastOptions } from '@/src/shared/lib';

interface Props {
	account: Account;
}

export const AccountItem: React.FC<Props> = ({ account }) => {
	const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
		useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const handleDelete = async () => {
		try {
			await axios.delete(`/api/accounts/${account.id}`);
			setIsConfirmDeleteDialogOpen(false);
			toast.success('Счёт успешно удалён!', toastOptions);
		} catch (err) {
			console.error('Ошибка удаления счета', err);
			toast.error('Ошибка удаления счета', toastOptions);
		}
	};

	return (
		<>
			<li className='flex flex-row justify-between items-center gap-2 bg-[var(--muted)] rounded-[8px] py-2 px-3.5'>
				<div className='flex flex-col gap-0.5'>
					<span className='font-medium text-[15px] text-[var(--foreground-primary)]'>
						{account.name}
					</span>
					<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
						{account.balance.toLocaleString('ru-RU', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}{' '}
						{account.currency}
					</span>
				</div>

				<div className='flex flex-row items-center gap-2.5'>
					<EditButton onClick={() => setIsEditModalOpen(true)} />
					<DeleteButton onClick={() => setIsConfirmDeleteDialogOpen(true)} />
				</div>
			</li>

			<ConfirmDeleteDialog
				isOpen={isConfirmDeleteDialogOpen}
				onClose={() => setIsConfirmDeleteDialogOpen(false)}
				onConfirm={handleDelete}
				accountName={account.name}
			/>

			<EditAccountModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				account={account}
			/>

			{createPortal(<Toaster />, document.body)}
		</>
	);
};
