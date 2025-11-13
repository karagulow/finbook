import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { DeleteButton, EditButton } from '@/src/shared/ui';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';
import { EditAccountModal } from '../../edit-account-modal';

import { Account } from '../model/types';
import { toastOptions, api } from '@/src/shared/lib';
import { GripVertical } from 'lucide-react';

interface Props {
	id: string;
	account: Account;
}

export const AccountItem: React.FC<Props> = ({ id, account }) => {
	const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
		useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const queryClient = useQueryClient();

	const handleDelete = async () => {
		setIsLoading(true);
		try {
			await api.delete(`/api/accounts/${account.id}`);
			queryClient.invalidateQueries({ queryKey: ['accounts'] });
			queryClient.invalidateQueries({ queryKey: ['balance'] });
			setIsConfirmDeleteDialogOpen(false);
			toast.success('Счёт успешно удалён!', toastOptions);
		} catch (err) {
			console.error('Ошибка удаления счета', err);
			toast.error('Ошибка удаления счета', toastOptions);
		}
		setIsLoading(false);
	};

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<>
			<li
				className='flex flex-row items-center gap-0.5 w-full'
				ref={setNodeRef}
				style={style}
			>
				<GripVertical
					className='text-[var(--foreground-secondary)] outline-none cursor-grab active:cursor-grabbing touch-none select-none'
					{...attributes}
					{...listeners}
				/>

				<div className='flex flex-row justify-between items-center gap-2 w-full bg-[var(--muted)] rounded-[8px] py-2 px-3.5'>
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
				</div>
			</li>

			<ConfirmDeleteDialog
				isOpen={isConfirmDeleteDialogOpen}
				onClose={() => setIsConfirmDeleteDialogOpen(false)}
				onConfirm={handleDelete}
				accountName={account.name}
				loading={isLoading}
			/>

			<EditAccountModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				account={account}
			/>
		</>
	);
};
