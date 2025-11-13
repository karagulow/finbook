'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoginFormData } from '../model/types';
import { loginValidation } from '../model/validations';
import { toastOptions, api } from '@/src/shared/lib';
import { Button, Input } from '@/src/shared/ui';
import { useAuthStore } from '@/src/shared/store/authStore';

export const LoginForm: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const { setAuth } = useAuthStore();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: yupResolver(loginValidation),
	});

	const onSubmit = async (data: LoginFormData) => {
		if (!navigator.onLine) {
			toast.error('Нет соединения с интернетом', toastOptions);
			setLoading(false);
			return;
		}

		setLoading(true);
		try {
			const response = await api.post('/api/auth/login', data);
			setAuth(response.data.token, { email: data.email });
			toast.success('Успешный вход!', toastOptions);
			setTimeout(() => router.push('/'), 1000);
		} catch (error: unknown) {
			let message = 'Ошибка авторизации';

			if (axios.isAxiosError(error)) {
				message = error.response?.data?.message || error.message || message;
			} else if (error instanceof Error) {
				message = error.message;
			}

			toast.error(message, toastOptions);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			className='flex flex-col items-center gap-[30px] w-full max-w-[332px] px-4'
			onSubmit={handleSubmit(onSubmit)}
		>
			<h1 className='font-semibold text-[18px] text-[var(--foreground-primary)]'>
				Авторизация
			</h1>

			<div className='flex flex-col w-full gap-4'>
				<Input
					placeholder='Введите почту'
					{...register('email')}
					error={errors.email?.message}
				/>

				<Input
					placeholder='Введите пароль'
					type='password'
					{...register('password')}
					error={errors.password?.message}
				/>
			</div>

			<Button className='p-0 w-full h-12' type='submit' disabled={loading}>
				{loading ? 'Загрузка...' : 'Войти'}
			</Button>

			<span className='font-regular text-[13px] text-[var(--foreground-secondary)]'>
				Ещё нет аккаунта?{' '}
				<Link
					className='text-[var(--foreground-primary)] hover:underline'
					href='/registration'
				>
					Зарегистрироваться
				</Link>
			</span>
		</form>
	);
};
