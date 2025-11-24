import React, { useState } from 'react';
import { Button, Dialog } from '@/src/shared/ui';
import { useSessions } from '../../model/use-sessions';

interface Props {
	sessionId: string;
	isOpen: boolean;
	onClose: () => void;
}

export const DeleteSessionDialog: React.FC<Props> = ({
	sessionId,
	isOpen,
	onClose,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const { deleteSession } = useSessions();

	const handleDelete = async () => {
		try {
			setIsLoading(true);
			await deleteSession(sessionId);
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
					Завершить сессию
				</h2>
				<p className='text-[var(--foreground-secondary)] text-[13px]'>
					Вы действительно хотите завершить этот сеанс?
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
