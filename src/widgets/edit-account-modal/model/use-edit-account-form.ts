'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

import { toastOptions } from '@/src/shared/lib';
import {
	Currency,
	FormValues,
	EditAccountModalContentProps,
} from '../model/types';

export const useEditAccountForm = (
	onClose: () => void,
	account: EditAccountModalContentProps['account']
) => {
	const [currencies, setCurrencies] = useState<Currency[]>([]);
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isLoading },
	} = useForm<FormValues>({
		defaultValues: {
			name: account.name,
			currencyId: account.currencyId,
			amount: account.balance,
		},
	});

	useEffect(() => {
		axios
			.get<Currency[]>('/api/currencies')
			.then(res => setCurrencies(res.data))
			.catch(() => toast.error('Не удалось загрузить валюты', toastOptions));
	}, []);

	const onSubmit = async (data: FormValues) => {
		try {
			await axios.put(`/api/accounts/${account.id}`, {
				...data,
				amount: Number(data.amount),
			});

			queryClient.invalidateQueries({ queryKey: ['accounts'] });
			queryClient.invalidateQueries({ queryKey: ['balance'] });

			toast.success('Счёт успешно обновлён!', toastOptions);
			onClose();
		} catch (error) {
			console.error('Ошибка при обновлении счёта:', error);
			toast.error('Ошибка при обновлении счёта', toastOptions);
		}
	};

	return {
		register,
		handleSubmit,
		control,
		errors,
		isLoading,
		currencies,
		onSubmit,
	};
};
