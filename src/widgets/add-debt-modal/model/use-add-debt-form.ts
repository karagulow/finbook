'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { endOfMonth } from 'date-fns';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { DebtType } from '@/src/entities/debt';
import { api, toastOptions } from '@/src/shared/lib';
import { AddDebtFormValues } from './types';

const schema: yup.ObjectSchema<AddDebtFormValues> = yup.object({
	type: yup
		.mixed<DebtType>()
		.oneOf(['OWED_BY_ME', 'OWED_TO_ME'])
		.required('Выберите тип долга'),
	name: yup.string().trim().required('Укажите, кто занял'),
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
		.typeError('Выберите дату возврата')
		.required('Выберите дату возврата'),
	description: yup.string().defined(),
});

export const useAddDebtForm = (onClose: () => void, initialType: DebtType) => {
	const queryClient = useQueryClient();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<AddDebtFormValues>({
		resolver: yupResolver(schema),
		defaultValues: {
			type: initialType,
			name: '',
			targetAmount: '',
			deadline: endOfMonth(new Date()),
			description: '',
		},
	});

	const onSubmit = async (data: AddDebtFormValues) => {
		try {
			await api.post('/api/debts', {
				type: data.type,
				name: data.name.trim(),
				targetAmount: Number(data.targetAmount),
				deadline: data.deadline.toISOString(),
				description: data.description.trim() || null,
			});

			await queryClient.invalidateQueries({ queryKey: ['debts'] });
			toast.success('Долг успешно добавлен!', toastOptions);
			reset({
				type: initialType,
				name: '',
				targetAmount: '',
				deadline: endOfMonth(new Date()),
				description: '',
			});
			onClose();
		} catch (err: unknown) {
			let message = 'Ошибка при добавлении долга';

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
