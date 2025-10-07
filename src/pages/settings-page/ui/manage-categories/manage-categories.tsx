import React, { useState } from 'react';

import { SettingsBlockItem } from '../settings-block-layout';
import { Button } from '@/src/shared/ui';
import { CategoriesModal } from './categories-modal';

export const ManageCategories: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	return (
		<>
			<SettingsBlockItem>
				<div className='flex flex-col gap-1.5'>
					<span className='text-[15px] text-[var(--foreground-primary)]'>
						Категории
					</span>
					<span>Выбор категорий и подкатегорий транзакций.</span>
				</div>
				<Button className='w-full sm:w-fit' onClick={openModal}>
					Настроить
				</Button>
			</SettingsBlockItem>

			<CategoriesModal isOpen={isModalOpen} onClose={closeModal} />
		</>
	);
};
