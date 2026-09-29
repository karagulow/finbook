import React from 'react';

import { Dialog } from '@/src/shared/ui/dialog';
import { Button } from '@/src/shared/ui/button';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading: boolean;
}

export const ConfirmDeleteOperationDialog: React.FC<Props> = ({
	isOpen,
	onClose,
	onConfirm,
	loading,
}) => {
	return (
		<Dialog isOpen={isOpen} onClose={onClose}>
			<div className='flex flex-col gap-4'>
				<h2 className='font-semibold text-[17px] text-[var(--foreground-primary)]'>
					Удалить транзакцию
				</h2>
				<p className='text-[13px] text-[var(--foreground-secondary)]'>
					Вы уверены, что хотите удалить транзакцию?
				</p>
				<div className='flex w-full justify-end gap-3'>
					<Button
						className='w-full'
						variant='default'
						disabled={loading}
						onClick={onClose}
					>
						Отмена
					</Button>
					<Button
						className='w-full'
						variant='wrong'
						disabled={loading}
						onClick={onConfirm}
					>
						{loading ? 'Удаление...' : 'Удалить'}
					</Button>
				</div>
			</div>
		</Dialog>
	);
};
