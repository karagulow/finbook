'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { DebtType } from '@/src/entities/debt';
import { api, toastOptions } from '@/src/shared/lib';
import { EditableDebt, EditDebtFormValues } from './types';

const schema: yup.ObjectSchema<EditDebtFormValues> = yup.object({
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

export const useEditDebtForm = (onClose: () => void, debt: EditableDebt) => {
	const queryClient = useQueryClient();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<EditDebtFormValues>({
		resolver: yupResolver(schema),
		defaultValues: {
			type: debt.type,
			name: debt.name,
			targetAmount: String(debt.targetAmount),
			deadline: new Date(debt.deadline),
			description: debt.description ?? '',
		},
	});

	const onSubmit = async (data: EditDebtFormValues) => {
		try {
			await api.put(`/api/debts/${debt.id}`, {
				type: data.type,
				name: data.name.trim(),
				targetAmount: Number(data.targetAmount),
				deadline: data.deadline.toISOString(),
				description: data.description.trim() || null,
			});

			await queryClient.invalidateQueries({ queryKey: ['debts'] });
			toast.success('Долг успешно обновлён!', toastOptions);
			onClose();
		} catch (err: unknown) {
			let message = 'Ошибка при обновлении долга';

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
