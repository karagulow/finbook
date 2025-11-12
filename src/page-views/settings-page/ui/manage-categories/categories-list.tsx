import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import autoAnimate from '@formkit/auto-animate';

import { CategoryItem } from './category-item';
import { CategoryItemSkeleton } from './category-item-skeleton';
import { Category } from '../../model/use-categories';
import { toastOptions } from '@/src/shared/lib';

interface Props {
	loading: boolean;
	categories: Category[];
}

export const CategoriesList: React.FC<Props> = ({ loading, categories }) => {
	const [items, setItems] = useState(categories);
	const queryClient = useQueryClient();

	const sensors = useSensors(useSensor(PointerSensor));
	const listRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		if (listRef.current) {
			autoAnimate(listRef.current, { duration: 200, easing: 'ease-in-out' });
		}
	}, []);

	const reorderMutation = useMutation({
		mutationFn: async (newItems: Category[]) => {
			await axios.patch('/api/categories/reorder', {
				orderedIds: newItems.map(i => i.id),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
			toast.success('Порядок сохранён', toastOptions);
		},
		onError: () => {
			toast.error('Ошибка при сохранении порядка', toastOptions);
		},
	});

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = items.findIndex(i => i.id === active.id);
		const newIndex = items.findIndex(i => i.id === over.id);

		const newItems = arrayMove(items, oldIndex, newIndex);
		setItems(newItems);
		reorderMutation.mutate(newItems);
	};

	useEffect(() => {
		setItems(categories);
	}, [categories]);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={items.map(i => i.id)}
				strategy={verticalListSortingStrategy}
			>
				<ul
					className='flex flex-col gap-2.5 flex-1 overflow-y-auto w-full'
					ref={listRef}
				>
					{loading ? (
						[...Array(5)].map((_, i) => <CategoryItemSkeleton key={i} />)
					) : items.length ? (
						items.map(category => (
							<CategoryItem
								key={category.id}
								id={category.id}
								category={category}
							/>
						))
					) : (
						<span className='text-[var(--foreground-secondary)]'>
							Нет категорий
						</span>
					)}
				</ul>
			</SortableContext>
		</DndContext>
	);
};
