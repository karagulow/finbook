'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { api, toastOptions } from '@/src/shared/lib';
import { EditableGoal, EditGoalFormValues } from './types';

const schema: yup.ObjectSchema<EditGoalFormValues> = yup.object({
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

export const useEditGoalForm = (onClose: () => void, goal: EditableGoal) => {
	const queryClient = useQueryClient();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<EditGoalFormValues>({
		resolver: yupResolver(schema),
		defaultValues: {
			name: goal.name,
			icon: goal.icon,
			targetAmount: String(goal.targetAmount),
			deadline: new Date(goal.deadline),
			description: goal.description ?? '',
		},
	});

	const onSubmit = async (data: EditGoalFormValues) => {
		try {
			await api.put(`/api/goals/${goal.id}`, {
				name: data.name.trim(),
				icon: data.icon,
				targetAmount: Number(data.targetAmount),
				deadline: data.deadline.toISOString(),
				description: data.description.trim() || null,
			});

			await queryClient.invalidateQueries({ queryKey: ['goals'] });
			toast.success('Цель успешно обновлена!', toastOptions);
			onClose();
		} catch (err: unknown) {
			let message = 'Ошибка при обновлении цели';

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
