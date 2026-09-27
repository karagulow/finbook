'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { endOfMonth } from 'date-fns';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { api, toastOptions } from '@/src/shared/lib';
import { CreateGoalFormValues } from './types';

const schema: yup.ObjectSchema<CreateGoalFormValues> = yup.object({
	name: yup.string().trim().required('Введите название цели'),
	icon: yup.string().trim().required('Выберите эмодзи'),
	targetAmount: yup
		.string()
		.required('Введите сумму')
		.test(
			'positive',
			'Сумма должна быть больше 0',
			value => Number(value) > 0,
		),
	deadline: yup
		.date()
		.typeError('Выберите дату окончания')
		.required('Выберите дату окончания'),
	description: yup.string().defined(),
});

export const useCreateGoalForm = (onClose: () => void) => {
	const queryClient = useQueryClient();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<CreateGoalFormValues>({
		resolver: yupResolver(schema),
		defaultValues: {
			name: '',
			icon: '',
			targetAmount: '',
			deadline: endOfMonth(new Date()),
			description: '',
		},
	});

	const onSubmit = async (data: CreateGoalFormValues) => {
		try {
			await api.post('/api/goals', {
				name: data.name.trim(),
				icon: data.icon,
				targetAmount: Number(data.targetAmount),
				deadline: data.deadline.toISOString(),
				description: data.description.trim() || null,
			});

			await queryClient.invalidateQueries({ queryKey: ['goals'] });
			toast.success('Цель успешно создана!', toastOptions);
			reset({
				name: '',
				icon: '',
				targetAmount: '',
				deadline: endOfMonth(new Date()),
				description: '',
			});
			onClose();
		} catch (err: unknown) {
			let message = 'Ошибка при создании цели';

			if (axios.isAxiosError(err)) {
				message = err.response?.data?.message || err.message || message;
			} else if (err instanceof Error) {
				message = err.message;
			}

			toast.error(message, toastOptions);
		}
	};

	return {
		control,
		handleSubmit,
		errors,
		isSubmitting,
		onSubmit,
	};
};
