'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { DebtType } from '@/src/entities/debt';
import { api, toastOptions } from '@/src/shared/lib';
import { DebtOperationFormValues } from './types';

interface Params {
	debtId: string;
	debtType: DebtType;
	remaining: number;
	onClose: () => void;
}

const createSchema = (remaining: number) =>
	yup.object({
		amount: yup
			.string()
			.required('Введите сумму')
			.test('positive', 'Сумма должна быть больше 0', value => Number(value) > 0)
			.test('remaining', 'Сумма больше остатка долга', value => {
				return Number(value) <= remaining + 0.001;
			}),
		date: yup.date().typeError('Выберите дату').required('Выберите дату'),
		description: yup.string().defined(),
	});

export const useDebtOperationForm = ({
	debtId,
	debtType,
	remaining,
	onClose,
}: Params) => {
	const queryClient = useQueryClient();
	const isReceive = debtType === 'OWED_TO_ME';

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<DebtOperationFormValues>({
		resolver: yupResolver(createSchema(remaining)),
		defaultValues: {
			amount: '',
			date: new Date(),
			description: '',
		},
	});

	const onSubmit = async (data: DebtOperationFormValues) => {
		try {
			await api.post(`/api/debts/${debtId}/operations`, {
				amount: Number(data.amount),
				date: data.date.toISOString(),
				description: data.description.trim() || null,
			});

			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ['debts'] }),
				queryClient.invalidateQueries({ queryKey: ['accounts'] }),
				queryClient.invalidateQueries({ queryKey: ['balance'] }),
			]);

			toast.success(
				isReceive ? 'Возврат получен' : 'Сумма возвращена',
				toastOptions,
			);
			reset({
				amount: '',
				date: new Date(),
				description: '',
			});
			onClose();
		} catch (err: unknown) {
			let message = isReceive
				? 'Не удалось получить возврат'
				: 'Не удалось вернуть сумму';

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
		isReceive,
		onSubmit,
	};
};
