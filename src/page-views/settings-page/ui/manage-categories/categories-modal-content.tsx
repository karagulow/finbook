'use client';

import React, { useState } from 'react';

import { CreateCategoryModal } from './create-category-modal';
import { useCategories } from '../../model/use-categories';
import { Button, Tabs } from '@/src/shared/ui';
import { CategoriesList } from './categories-list';

export const CategoriesModalContent: React.FC = () => {
	const transactionTypes = ['Доходы', 'Расходы'];
	const [activeTransactionType, setActiveTransactionType] = useState(
		transactionTypes[1]
	);

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const openCreateModal = () => setIsCreateModalOpen(true);
	const closeCreateModal = () => setIsCreateModalOpen(false);

	const { categories, loading } = useCategories();

	const filteredCategories = categories.filter(c =>
		activeTransactionType === transactionTypes[0]
			? c.type === 'INCOME'
			: c.type === 'EXPENSE'
	);

	return (
		<>
			<div className='flex flex-col gap-5 h-full'>
				<h2 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
					Категории
				</h2>

				<Tabs
					items={transactionTypes}
					activeItem={activeTransactionType}
					setActiveItem={setActiveTransactionType}
					tabName='transaction-type'
				/>

				<CategoriesList loading={loading} categories={filteredCategories} />

				<Button type='submit' onClick={openCreateModal}>
					Создать категорию
				</Button>
			</div>

			<CreateCategoryModal
				isOpen={isCreateModalOpen}
				onClose={closeCreateModal}
			/>
		</>
	);
};
