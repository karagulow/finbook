import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import { DeleteButton, EditButton } from '@/src/shared/ui';

import { Account } from '../model/types';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';

import { toastOptions } from '@/src/shared/lib';

interface Props {
	account: Account;
}

export const AccountItem: React.FC<Props> = ({ account }) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleDelete = async () => {
		try {
			await axios.delete(`/api/accounts/${account.id}`);
			setIsDialogOpen(false);
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
					<EditButton />
					<DeleteButton onClick={() => setIsDialogOpen(true)} />
				</div>
			</li>

			<ConfirmDeleteDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				onConfirm={handleDelete}
				accountName={account.name}
			/>

			{createPortal(<Toaster />, document.body)}
		</>
	);
};
