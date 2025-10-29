import React, { useState } from 'react';

import { Button } from '@/src/shared/ui';
import { LogOut } from 'lucide-react';
import { ConfirmLogoutDialog } from '@/src/features/confirm-logout-dialog/ui/confirm-logout-dialog';

export const LogoutButton: React.FC = () => {
	const [isConfirmLogoutDialogOpen, setIsConfirmLogoutDialogOpen] =
		useState(false);

	return (
		<>
			<Button
				className='w-full sm:w-fit'
				variant='wrong'
				onClick={() => setIsConfirmLogoutDialogOpen(true)}
			>
				<LogOut size={16} strokeWidth={1} />
				Выйти из аккаунта
			</Button>

			<ConfirmLogoutDialog
				isOpen={isConfirmLogoutDialogOpen}
				onClose={() => setIsConfirmLogoutDialogOpen(false)}
			/>
		</>
	);
};
