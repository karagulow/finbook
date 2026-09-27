'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { api, toastOptions } from '@/src/shared/lib';
import { GoalOperationFormValues, GoalOperationType } from './types';

interface Params {
	goalId: string;
	type: GoalOperationType;
	availableAmount: number;
	onClose: () => void;
}

const createSchema = (type: GoalOperationType, availableAmount: number) =>
	yup.object({
		amount: yup
			.string()
			.required('Введите сумму')
			.test('positive', 'Сумма должна быть больше 0', value => Number(value) > 0)
			.test('available', 'Сумма больше доступной для снятия', value => {
				if (type !== 'WITHDRAW') return true;
				return Number(value) <= availableAmount;
			}),
		date: yup.date().typeError('Выберите дату').required('Выберите дату'),
		description: yup.string().defined(),
	});

export const useGoalOperationForm = ({
	goalId,
	type,
	availableAmount,
	onClose,
}: Params) => {
	const queryClient = useQueryClient();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<GoalOperationFormValues>({
		resolver: yupResolver(createSchema(type, availableAmount)),
		defaultValues: {
			amount: '',
			date: new Date(),
			description: '',
		},
	});

	const onSubmit = async (data: GoalOperationFormValues) => {
		try {
			await api.post(`/api/goals/${goalId}/operations`, {
				type,
				amount: Number(data.amount),
				date: data.date.toISOString(),
				description: data.description.trim() || null,
			});

			await queryClient.invalidateQueries({ queryKey: ['goals'] });
			toast.success(
				type === 'DEPOSIT' ? 'Цель пополнена' : 'Средства сняты',
				toastOptions,
			);
			reset({
				amount: '',
				date: new Date(),
				description: '',
			});
			onClose();
		} catch (err: unknown) {
			let message =
				type === 'DEPOSIT'
					? 'Не удалось пополнить цель'
					: 'Не удалось снять средства';

			if (axios.isAxiosError(err)) {
				message = err.response?.data?.message || err.message || message;
			} else if (err instanceof Error) {
				message = err.message;
			}

			toast.error(message, toastOptions);
		}
	};

	return { control, handleSubmit, errors, isSubmitting, onSubmit };
};
