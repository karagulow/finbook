import React from 'react';

import { Dialog } from '@/src/shared/ui/dialog';
import { Button } from '@/src/shared/ui/button';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export const ConfirmDeleteDialog: React.FC<Props> = ({
	isOpen,
	onClose,
	onConfirm,
}) => {
	return (
		<Dialog isOpen={isOpen} onClose={onClose}>
			<div className='flex flex-col gap-4'>
				<h2 className='text-[17px] font-semibold text-[var(--foreground-primary)]'>
					Удалить транзакцию
				</h2>
				<p className='text-[var(--foreground-secondary)] text-[13px]'>
					Вы уверены, что хотите удалить транзакцию?
				</p>
				<div className='flex justify-end gap-3 w-full'>
					<Button className='w-full' variant='default' onClick={onClose}>
						Отмена
					</Button>
					<Button className='w-full' variant='wrong' onClick={onConfirm}>
						Удалить
					</Button>
				</div>
			</div>
		</Dialog>
	);
};
