import React, { useState } from 'react';

import { SettingsBlockItem } from '../settings-block-layout';
import { Button } from '@/src/shared/ui';
import { Trash } from 'lucide-react';
import { DeleteUserDialog } from './delete-user-dialog';
import { User } from '../../model/types';

interface DeleteUserProps {
	user: User;
}

export const DeleteUser: React.FC<DeleteUserProps> = ({ user }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	return (
		<>
			<SettingsBlockItem>
				<div className='flex flex-col gap-1.5'>
					<span className='text-[15px] text-[var(--foreground-primary)]'>
						Учётная запись
					</span>
					<span>
						После удаления аккаунта восстановление невозможно.
						<br />
						Пожалуйста, убедитесь в своем решении.
					</span>
				</div>
				<Button className='w-full sm:w-fit' variant='wrong' onClick={openModal}>
					<Trash size={16} strokeWidth={1} />
					Удалить
				</Button>
			</SettingsBlockItem>

			<DeleteUserDialog isOpen={isModalOpen} onClose={closeModal} user={user} />
		</>
	);
};
