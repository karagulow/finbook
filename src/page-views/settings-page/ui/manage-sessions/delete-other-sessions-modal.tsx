import React, { useState } from 'react';
import { Button, Dialog } from '@/src/shared/ui';
import { useSessions } from '../../model/use-sessions';

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export const DeleteOtherSessionsDialog: React.FC<Props> = ({
	isOpen,
	onClose,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const { deleteOtherSessions } = useSessions();

	const handleDelete = async () => {
		try {
			setIsLoading(true);
			await deleteOtherSessions();
			onClose();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog isOpen={isOpen} onClose={onClose}>
			<div className='flex flex-col gap-4'>
				<h2 className='text-[17px] font-semibold text-[var(--foreground-primary)]'>
					Завершить другие сеансы
				</h2>
				<p className='text-[var(--foreground-secondary)] text-[13px]'>
					Вы действительно хотите завершить все сессии, кроме текущей?
				</p>

				<div className='flex justify-end gap-3 w-full'>
					<Button
						className='w-full'
						variant='default'
						onClick={onClose}
						disabled={isLoading}
					>
						Отмена
					</Button>
					<Button
						className='w-full'
						variant='wrong'
						onClick={handleDelete}
						disabled={isLoading}
					>
						{isLoading ? 'Завершение...' : 'Завершить'}
					</Button>
				</div>
			</div>
		</Dialog>
	);
};
