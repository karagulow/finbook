'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

import { RegistrationFormData } from '../model/types';
import { registrationValidation } from '../model/validations';
import { toastOptions } from '@/shared/lib';
import { Button, Input } from '@/shared/ui';
import { useAuthStore } from '@/shared/store/authStore';

export const RegistrationForm: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const { setAuth } = useAuthStore();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegistrationFormData>({
		resolver: yupResolver(registrationValidation),
	});

	const onSubmit = async (data: RegistrationFormData) => {
		if (!navigator.onLine) {
			toast.error('Нет соединения с интернетом', toastOptions);
			setLoading(false);
			return;
		}

		setLoading(true);
		try {
			const response = await axios.post('/api/auth/register', {
				email: data.email,
				password: data.password,
			});
			setAuth(response.data.token, { email: data.email });
			toast.success('Регистрация успешна!', toastOptions);
			router.push('/');
		} catch (error: any) {
			toast.error(
				error.response?.data?.message || 'Ошибка регистрации',
				toastOptions
			);
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
				Регистрация
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

				<Input
					placeholder='Подтвердите пароль'
					type='password'
					{...register('confirmPassword')}
					error={errors.confirmPassword?.message}
				/>
			</div>

			<Button className='p-0 w-full h-12' type='submit' disabled={loading}>
				{loading ? 'Загрузка...' : 'Зарегистрироваться'}
			</Button>

			<span className='font-regular text-[13px] text-[var(--foreground-secondary)]'>
				Уже есть аккаунт?{' '}
				<Link
					className='text-[var(--foreground-primary)] hover:underline'
					href='/login'
				>
					Войти
				</Link>
			</span>

			<Toaster toastOptions={toastOptions} />
		</form>
	);
};
