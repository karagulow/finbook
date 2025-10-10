import React, { useState } from 'react';

import { SettingsBlockItem } from '../settings-block-layout';
import { Button } from '@/src/shared/ui';
import { ChangePasswordModal } from './change-password-modal';

export const ChangePassword: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	return (
		<>
			<SettingsBlockItem>
				<div className='flex flex-col gap-1.5'>
					<span className='text-[15px] text-[var(--foreground-primary)]'>
						Пароль
					</span>
					<span>Изменить свой пароль для входа в аккаунт.</span>
				</div>

				<Button className='w-full sm:w-fit' onClick={openModal}>
					Поменять пароль
				</Button>
			</SettingsBlockItem>

			<ChangePasswordModal isOpen={isModalOpen} onClose={closeModal} />
		</>
	);
};
