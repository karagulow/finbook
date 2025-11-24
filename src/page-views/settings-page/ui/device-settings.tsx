import React, { useState } from 'react';
import {
	SettingsBlockItem,
	SettingsBlockLayout,
} from './settings-block-layout';
import { Button, Divider } from '@/src/shared/ui';
import { Session } from '../model/use-sessions';
import { DeleteSessionDialog } from './manage-sessions/delete-session-dialog';
import { DeleteOtherSessionsDialog } from './manage-sessions/delete-other-sessions-modal';

interface DeviceSettingsProps {
	sessions: Session[];
}

export const DeviceSettings: React.FC<DeviceSettingsProps> = ({ sessions }) => {
	const [isDeleteSessionModalOpen, setIsDeleteSessionModalOpen] =
		useState(false);
	const [isDeleteOtherSessionsModalOpen, setIsDeleteOtherSessionsModalOpen] =
		useState(false);

	const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
		null
	);

	const openDeleteSessionModal = (id: string) => {
		setSelectedSessionId(id);
		setIsDeleteSessionModalOpen(true);
	};
	const closeDeleteSessionModal = () => {
		setIsDeleteSessionModalOpen(false);
		setSelectedSessionId(null);
	};

	const openDeleteOtherSessionsModal = () => {
		setIsDeleteOtherSessionsModalOpen(true);
	};
	const closeDeleteOtherSessionsModal = () => {
		setIsDeleteOtherSessionsModalOpen(false);
	};

	return (
		<SettingsBlockLayout title='Устройства'>
			{sessions.map(session => (
				<React.Fragment key={session.id}>
					<SettingsBlockItem>
						<div className='flex flex-col gap-1.5'>
							<p className='text-[15px] text-[var(--foreground-primary)]'>
								{session.deviceInfo}
								{session.isCurrent && (
									<span className='text-[var(--success)]'>
										{' '}
										• Текущий сеанс
									</span>
								)}
							</p>
							<p>{new Date(session.createdAt).toLocaleDateString('ru-RU')}</p>
						</div>
						{!session.isCurrent && (
							<Button
								className='w-full sm:w-fit'
								variant='wrong'
								onClick={() => openDeleteSessionModal(session.id)}
							>
								Завершить сессию
							</Button>
						)}
					</SettingsBlockItem>

					<Divider />
				</React.Fragment>
			))}

			<Button
				className='w-full sm:w-fit'
				variant='wrong'
				onClick={openDeleteOtherSessionsModal}
			>
				Завершить все сессии, кроме текущей
			</Button>

			<DeleteSessionDialog
				isOpen={isDeleteSessionModalOpen}
				onClose={closeDeleteSessionModal}
				sessionId={selectedSessionId || ''}
			/>
			<DeleteOtherSessionsDialog
				isOpen={isDeleteOtherSessionsModalOpen}
				onClose={closeDeleteOtherSessionsModal}
			/>
		</SettingsBlockLayout>
	);
};
