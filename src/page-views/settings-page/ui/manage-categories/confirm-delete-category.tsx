import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { Button, Dialog } from '@/src/shared/ui';
import { toastOptions, api } from '@/src/shared/lib';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	category: {
		id: string;
		name: string;
	};
}

export const ConfirmDeleteCategory: React.FC<Props> = ({
	isOpen,
	onClose,
	category,
}) => {
	const queryClient = useQueryClient();

	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		try {
			setLoading(true);
			await api.delete(`/api/categories/${category.id}`);
			queryClient.invalidateQueries({ queryKey: ['categories'] });

			toast.success('Категория успешно удалена!', toastOptions);
			onClose();
		} catch (err) {
			console.error('Ошибка удаления категории:', err);
			toast.error('Ошибка при удалении категории', toastOptions);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog isOpen={isOpen} onClose={onClose}>
			<div className='flex flex-col gap-4'>
				<h2 className='text-[17px] font-semibold text-[var(--foreground-primary)]'>
					Удалить категорию
				</h2>
				<p className='text-[var(--foreground-secondary)] text-[13px]'>
					Внимание! При удалении категории будут удалены все связанные с нею
					транзакции.
				</p>
				<p className='text-[var(--foreground-secondary)] text-[13px]'>
					Вы уверены, что хотите удалить категорию{' '}
					<span className='font-medium'>&quot;{category.name}&quot;</span>?
					<br />
				</p>
				<div className='flex justify-end gap-3 w-full'>
					<Button
						className='w-full'
						variant='default'
						onClick={onClose}
						disabled={loading}
					>
						Отмена
					</Button>
					<Button
						className='w-full'
						variant='wrong'
						onClick={handleDelete}
						disabled={loading}
					>
						{loading ? 'Удаление...' : 'Удалить'}
					</Button>
				</div>
			</div>
		</Dialog>
	);
};
