'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import autoAnimate from '@formkit/auto-animate';
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
import {
	restrictToVerticalAxis,
	restrictToParentElement,
} from '@dnd-kit/modifiers';

import { AccountItem } from './account-item';
import { Account } from '../model/types';
import { toastOptions, api } from '@/src/shared/lib';

interface Props {
	accounts: Account[];
}

export const AccountList: React.FC<Props> = ({ accounts }) => {
	const [items, setItems] = useState(accounts);
	const queryClient = useQueryClient();

	const listRef = useRef<HTMLUListElement | null>(null);
	const sensors = useSensors(useSensor(PointerSensor));

	const reorderMutation = useMutation({
		mutationFn: async (newItems: Account[]) => {
			await api.patch('/api/accounts/reorder', {
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
		setItems(accounts);
	}, [accounts]);

	useEffect(() => {
		if (listRef.current) {
			autoAnimate(listRef.current, {
				duration: 250,
				easing: 'ease-in-out',
			});
		}
	}, []);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			modifiers={[restrictToVerticalAxis, restrictToParentElement]}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				<ul className='flex flex-col gap-2.5' ref={listRef}>
					{items.map(account => (
						<AccountItem key={account.id} id={account.id} account={account} />
					))}
				</ul>
			</SortableContext>
		</DndContext>
	);
};
