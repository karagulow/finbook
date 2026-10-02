'use client';

import React, { useState } from 'react';
import { api } from '@/src/shared/lib';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { Button, Dialog, Input } from '@/src/shared/ui';
import { User } from '../../model/types';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	user: User;
}

export const DeleteUserDialog: React.FC<Props> = ({
	isOpen,
	onClose,
	user,
}) => {
	const router = useRouter();
	const [emailInput, setEmailInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleDelete = async () => {
		try {
			setIsLoading(true);
			await api.delete('/api/user');
			toast.success('Аккаунт успешно удалён');
			onClose();
			router.push('/login');
		} catch (error) {
			console.error(error);
			toast.error('Ошибка при удалении аккаунта');
		} finally {
			setIsLoading(false);
		}
	};

	const isDisabled = isLoading || emailInput.trim() !== user.email;

	return (
		<Dialog isOpen={isOpen} onClose={onClose}>
			<div className='flex flex-col gap-4'>
				<h2 className='text-[17px] font-semibold text-[var(--foreground-primary)]'>
					Удалить аккаунт
				</h2>
				<p className='text-[var(--foreground-secondary)] text-[13px]'>
					Внимание! После подтверждения будет безвозвратно удалена ваша учетная
					запись, а также вся финансовая информация: история транзакций, счета,
					категории, цели и долги.
				</p>

				<Input
					label='Для подтверждения введите свою электронную почту'
					value={emailInput}
					onChange={e => setEmailInput(e.target.value)}
					placeholder={user.email}
					disabled={isLoading}
					inputMode='email'
				/>

				<div className='flex justify-end gap-3 w-full'>
					<Button
						className='w-full'
						variant='default'
						onClick={onClose}
						disabled={isLoading}
					>
						Отмена
					</Button>
					<Button
						className='w-full'
						variant='wrong'
						onClick={handleDelete}
						disabled={isDisabled}
					>
						{isLoading ? 'Удаление...' : 'Удалить'}
					</Button>
				</div>
			</div>
		</Dialog>
	);
};
