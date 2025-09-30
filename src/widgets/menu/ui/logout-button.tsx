'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { LogOut } from 'lucide-react';

import { ConfirmLogoutDialog } from '@/src/features/confirm-logout-dialog/ui/confirm-logout-dialog';

export const LogoutButton: React.FC = () => {
	const [isConfirmLogoutDialogOpen, setIsConfirmLogoutDialogOpen] =
		useState(false);

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<>
			<button
				className='flex flex-row items-center gap-2.5 p-2.5 w-full rounded-[6px] hover:bg-[#ff85830e] font-medium text-[13px] text-[var(--wrong)] transition cursor-pointer'
				onClick={() => setIsConfirmLogoutDialogOpen(true)}
			>
				<LogOut size={16} strokeWidth={1.5} />
				<span>Выйти</span>
			</button>

			{mounted &&
				createPortal(
					<ConfirmLogoutDialog
						isOpen={isConfirmLogoutDialogOpen}
						onClose={() => setIsConfirmLogoutDialogOpen(false)}
					/>,
					document.body
				)}
		</>
	);
};
