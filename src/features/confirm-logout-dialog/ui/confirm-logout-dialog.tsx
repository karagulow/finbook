'use client';

import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { Dialog } from '@/src/shared/ui/dialog';
import { Button } from '@/src/shared/ui/button';

import { toastOptions } from '@/src/shared/lib';
import { useAuthStore } from '@/src/shared/store/authStore';

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export const ConfirmLogoutDialog: React.FC<Props> = ({ isOpen, onClose }) => {
	const { logout } = useAuthStore();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await axios.post('/api/auth/logout');
			logout();
			router.replace('/login');
		} catch (error) {
			toast.error('Произошла ошибка.', toastOptions);
		}
	};

	return (
		<Dialog isOpen={isOpen} onClose={onClose}>
			<div className='flex flex-col gap-4'>
				<h2 className='text-[17px] font-semibold text-[var(--foreground-primary)]'>
					Выйти из аккаунта
				</h2>
				<p className='text-[var(--foreground-secondary)] text-[13px]'>
					Вы уверены, что хотите выйти из аккаунта?
				</p>
				<div className='flex justify-end gap-3 w-full'>
					<Button className='w-full' variant='default' onClick={onClose}>
						Отмена
					</Button>
					<Button className='w-full' variant='wrong' onClick={handleLogout}>
						Выйти
					</Button>
				</div>
			</div>
		</Dialog>
	);
};
