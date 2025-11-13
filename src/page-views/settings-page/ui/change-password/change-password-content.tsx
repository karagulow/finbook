'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { api } from '@/src/shared/lib';
import toast from 'react-hot-toast';

import { Button, Input } from '@/src/shared/ui';

interface Props {
	onClose: () => void;
}

interface FormValues {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

const schema = yup.object({
	currentPassword: yup.string().required('Введите текущий пароль'),
	newPassword: yup
		.string()
		.required('Введите новый пароль')
		.min(8, 'Минимум 8 символов')
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]*$/,
			'Пароль должен содержать заглавные и строчные буквы, цифры и специальные символы, без пробелов'
		)
		.notOneOf(
			[yup.ref('currentPassword')],
			'Новый пароль не должен совпадать с текущим'
		),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('newPassword')], 'Пароли не совпадают')
		.required('Подтвердите новый пароль'),
});

export const ChangePasswordContent: React.FC<Props> = ({ onClose }) => {
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormValues>({
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data: FormValues) => {
		try {
			setLoading(true);
			await api.post('/api/user/change-password', {
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			});
			toast.success('Пароль успешно изменён');
			reset();
			onClose();
		} catch (error: unknown) {
			let message = 'Ошибка при смене пароля';

			if (axios.isAxiosError(error)) {
				message = error.response?.data?.error || error.message || message;
			} else if (error instanceof Error) {
				message = error.message;
			}

			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	const isDisabled = loading;

	return (
		<div className='flex flex-col gap-5 h-full'>
			<h2 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
				Сменить пароль
			</h2>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col gap-5 h-full'
			>
				<div className='flex flex-col gap-5 flex-1 overflow-y-auto'>
					<Input
						label='Текущий пароль'
						placeholder='Введите текущий пароль'
						type='password'
						error={errors.currentPassword?.message}
						{...register('currentPassword')}
					/>
					<Input
						label='Новый пароль'
						placeholder='Введите новый пароль'
						type='password'
						error={errors.newPassword?.message}
						{...register('newPassword')}
					/>
					<Input
						label='Подтверждение пароля'
						placeholder='Подтвердите новый пароль'
						type='password'
						error={errors.confirmPassword?.message}
						{...register('confirmPassword')}
					/>
				</div>

				<Button type='submit' disabled={isDisabled}>
					{loading ? 'Загрузка...' : 'Поменять'}
				</Button>
			</form>
		</div>
	);
};
