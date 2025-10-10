import { Button, Tabs } from '@/src/shared/ui';
import React, { useEffect, useState } from 'react';
import { CategoryItem } from './category-item';
import { CategoryItemSkeleton } from './category-item-skeleton';
import { CreateCategoryModal } from './create-category-modal';

interface Props {
	onClose: () => void;
}

interface Category {
	id: string;
	name: string;
	icon: string | null;
	type: 'INCOME' | 'EXPENSE';
	subcategories: { id: string; name: string }[];
}

export const CategoriesModalContent: React.FC<Props> = ({ onClose }) => {
	const transactionTypes = ['Доходы', 'Расходы'];
	const [activeTransactionType, setActiveTransactionType] = useState(
		transactionTypes[1]
	);

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const openCreateModal = () => setIsCreateModalOpen(true);
	const closeCreateModal = () => setIsCreateModalOpen(false);

	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchCategories = async () => {
			setLoading(true);
			try {
				const res = await fetch('/api/categories');
				const data = await res.json();
				if (!res.ok) throw new Error(data.message);
				setCategories(data);
			} catch (e) {
				console.error('Ошибка при загрузке категорий:', e);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

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

				<ul className='flex flex-col gap-2.5 flex-1 overflow-y-auto'>
					{loading ? (
						[...Array(5)].map((_, i) => <CategoryItemSkeleton key={i} />)
					) : filteredCategories.length ? (
						filteredCategories.map(category => (
							<CategoryItem key={category.id} category={category} />
						))
					) : (
						<span className='text-[var(--foreground-secondary)]'>
							Нет категорий
						</span>
					)}
				</ul>

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
