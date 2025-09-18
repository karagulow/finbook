'use client';

import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

import { LogOut } from 'lucide-react';

import { toastOptions } from '../../../shared/lib';
import { useAuthStore } from '@/src/shared/store/authStore';

export const LogoutButton: React.FC = () => {
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
		<>
			<button
				className='flex flex-row items-center gap-2.5 p-2.5 w-full rounded-[6px] hover:bg-[#ff85830e] font-medium text-[13px] text-[var(--wrong)] transition cursor-pointer'
				onClick={handleLogout}
			>
				<LogOut size={16} strokeWidth={1.5} />
				<span>Выйти</span>
			</button>

			<Toaster toastOptions={toastOptions} />
		</>
	);
};
