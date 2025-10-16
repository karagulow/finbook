import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { DeleteButton, EditButton } from '@/src/shared/ui';
import { ConfirmDeleteCategory } from './confirm-delete-category';
import { EditCategoryModal } from './edit-category-modal';
import { GripVertical } from 'lucide-react';

interface Props {
	id: string;
	category: {
		id: string;
		name: string;
		icon: string;
		color: string;
		type: 'INCOME' | 'EXPENSE';
		subcategories: { id: string; name: string }[];
	};
}

export const CategoryItem: React.FC<Props> = ({ id, category }) => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const openDeleteModal = () => setIsDeleteModalOpen(true);
	const closeDeleteModal = () => setIsDeleteModalOpen(false);

	const openEditModal = () => setIsEditModalOpen(true);
	const closeEditModal = () => setIsEditModalOpen(false);

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
					className='text-[var(--foreground-secondary)] flex-shrink-0 outline-none cursor-grab active:cursor-grabbing touch-none select-none'
					{...attributes}
					{...listeners}
				/>

				<div className='flex flex-col flex-1 min-w-0 gap-2.5 items-start p-2.5 bg-[var(--muted)] rounded-[6px]'>
					<div className='flex flex-row items-center justify-between gap-2.5 w-full'>
						<div className='flex flex-row items-center gap-2.5'>
							<div className='flex items-center justify-center size-10 border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] rounded-[6px] flex-shrink-0 text-[20px]'>
								{category.icon}
							</div>
							<div className='flex flex-col gap-0.5'>
								<span className='font-medium text-[15px] text-[var(--foreground-primary)]'>
									{category.name}
								</span>
								<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
									{category.subcategories.length > 0
										? `Подкатегории: ${category.subcategories.length}`
										: 'Нет подкатегорий'}
								</span>
							</div>
						</div>

						<div className='flex flex-row items-center gap-2.5'>
							<EditButton onClick={openEditModal} />
							<DeleteButton onClick={openDeleteModal} />
						</div>
					</div>

					<div className='flex flex-row gap-1.5 items-center overflow-auto w-full scroll-thin'>
						{category.subcategories.map(subcat => (
							<span
								className='px-2 py-1 bg-[var(--button-secondary)] rounded-[4px] font-semibold text-[11px] text-[var(--foreground-primary)] whitespace-nowrap'
								key={subcat.id}
							>
								{subcat.name}
							</span>
						))}
					</div>
				</div>
			</li>

			<EditCategoryModal
				isOpen={isEditModalOpen}
				onClose={closeEditModal}
				category={category}
			/>

			<ConfirmDeleteCategory
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				category={category}
			/>
		</>
	);
};
