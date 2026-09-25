'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

import { Currency, RegistrationFormData } from '../model/types';
import { registrationValidation } from '../model/validations';
import { api, toastOptions } from '@/src/shared/lib';
import { Button, Input, Select } from '@/src/shared/ui';
import { useAuthStore } from '@/src/shared/store/authStore';

export const RegistrationForm: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const { setAuth } = useAuthStore();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<RegistrationFormData>({
		resolver: yupResolver(registrationValidation),
	});

	const [currencies, setCurrencies] = useState<Currency[]>([]);

	useEffect(() => {
		api.get<Currency[]>('/api/currencies').then(res => setCurrencies(res.data));
	}, []);

	const onSubmit = async (data: RegistrationFormData) => {
		if (!navigator.onLine) {
			toast.error('Нет соединения с интернетом', toastOptions);
			setLoading(false);
			return;
		}

		setLoading(true);
		try {
			const response = await api.post('/api/auth/registration', {
				email: data.email,
				password: data.password,
				currencyId: data.currencyId,
			});
			setAuth(response.data.token, { email: data.email });
			toast.success('Регистрация успешна!', toastOptions);
			router.push('/home');
		} catch (error: unknown) {
			let message = 'Ошибка регистрации';

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
			className='animate-blur-in flex flex-col items-center gap-[30px] w-full max-w-[332px] px-4'
			onSubmit={handleSubmit(onSubmit)}
		>
			<h1 className='font-semibold text-[18px] text-[var(--foreground-primary)]'>
				Регистрация
			</h1>

			<div className='flex flex-col w-full gap-4'>
				<Input
					placeholder='Введите почту'
					inputMode='email'
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

				<Controller
					name='currencyId'
					control={control}
					rules={{ required: 'Выберите валюту' }}
					render={({ field, fieldState }) => (
						<Select
							placeholder='Выберите валюту'
							value={field.value}
							onChange={field.onChange}
							error={fieldState.error?.message}
							options={currencies.map(c => ({
								value: c.id,
								label: `${c.name} (${c.code})`,
							}))}
						/>
					)}
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
		</form>
	);
};
