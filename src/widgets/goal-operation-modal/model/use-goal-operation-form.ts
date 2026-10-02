'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { api, toastOptions } from '@/src/shared/lib';
import {
	GoalOperationFormValues,
	GoalOperationInitial,
	GoalOperationType,
} from './types';

interface Params {
	goalId: string;
	type: GoalOperationType;
	availableAmount: number;
	minimumAmount?: number;
	operation?: GoalOperationInitial;
	onClose: () => void;
}

const createSchema = (
	type: GoalOperationType,
	availableAmount: number,
	minimumAmount: number,
) =>
	yup.object({
		amount: yup
			.string()
			.required('Введите сумму')
			.test('positive', 'Сумма должна быть больше 0', value => Number(value) > 0)
			.test('available', 'Сумма больше доступной для снятия', value => {
				if (type !== 'WITHDRAW') return true;
				return Number(value) <= availableAmount + 0.001;
			})
			.test('used', 'Часть суммы уже снята с цели', value => {
				if (minimumAmount <= 0) return true;
				return Number(value) + 0.001 >= minimumAmount;
			}),
		date: yup.date().typeError('Выберите дату').required('Выберите дату'),
		description: yup.string().defined(),
	});

export const useGoalOperationForm = ({
	goalId,
	type,
	availableAmount,
	minimumAmount = 0,
	operation,
	onClose,
}: Params) => {
	const queryClient = useQueryClient();
	const isEdit = Boolean(operation);

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<GoalOperationFormValues>({
		resolver: yupResolver(createSchema(type, availableAmount, minimumAmount)),
		defaultValues: {
			amount: operation ? String(operation.amount) : '',
			date: operation ? new Date(operation.date) : new Date(),
			description: operation?.description ?? '',
		},
	});

	const onSubmit = async (data: GoalOperationFormValues) => {
		const payload = {
			amount: Number(data.amount),
			date: data.date.toISOString(),
			description: data.description.trim() || null,
		};

		try {
			if (operation) {
				await api.put(`/api/goals/${goalId}/operations/${operation.id}`, payload);
			} else {
				await api.post(`/api/goals/${goalId}/operations`, {
					type,
					...payload,
				});
			}

			await queryClient.invalidateQueries({ queryKey: ['goals'] });
			toast.success(
				operation
					? 'Операция изменена'
					: type === 'DEPOSIT'
						? 'Цель пополнена'
						: 'Средства сняты',
				toastOptions,
			);
			reset({
				amount: '',
				date: new Date(),
				description: '',
			});
			onClose();
		} catch (err: unknown) {
			let message = operation
				? 'Не удалось изменить операцию'
				: type === 'DEPOSIT'
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

	return { control, handleSubmit, errors, isSubmitting, isEdit, onSubmit };
};
