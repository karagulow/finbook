'use client';

import React, { useState } from 'react';
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AccountItem } from './account-item';
import { Account } from '../model/types';
import toast from 'react-hot-toast';
import { toastOptions } from '@/src/shared/lib';

interface Props {
	accounts: Account[];
}

export const AccountList: React.FC<Props> = ({ accounts }) => {
	const [items, setItems] = useState(accounts);
	const queryClient = useQueryClient();

	const sensors = useSensors(useSensor(PointerSensor));

	const reorderMutation = useMutation({
		mutationFn: async (newItems: Account[]) => {
			await axios.patch('/api/accounts/reorder', {
				orderedIds: newItems.map(i => i.id),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['accounts'] });
			toast.success('Порядок сохранён', toastOptions);
		},
		onError: () => {
			toast.error('Ошибка при сохранении порядка', toastOptions);
		},
	});

	const handleDragEnd = (event: any) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = items.findIndex(i => i.id === active.id);
		const newIndex = items.findIndex(i => i.id === over.id);

		const newItems = arrayMove(items, oldIndex, newIndex);
		setItems(newItems);
		reorderMutation.mutate(newItems);
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				<ul className='flex flex-col gap-2.5'>
					{items.map(account => (
						<AccountItem key={account.id} id={account.id} account={account} />
					))}
				</ul>
			</SortableContext>
		</DndContext>
	);
};
