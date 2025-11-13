'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { toastOptions, api } from '@/src/shared/lib';
import { Currency, FormValues } from '../model/types';

export const useCreateAccountForm = (onClose: () => void) => {
	const [currencies, setCurrencies] = useState<Currency[]>([]);
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isLoading },
	} = useForm<FormValues>();

	useEffect(() => {
		api
			.get<Currency[]>('/api/currencies')
			.then(res => setCurrencies(res.data))
			.catch(() => toast.error('Не удалось загрузить валюты', toastOptions));
	}, []);

	const onSubmit = async (data: FormValues) => {
		try {
			await api.post('/api/accounts', {
				...data,
				amount: Number(data.amount),
			});

			queryClient.invalidateQueries({ queryKey: ['accounts'] });
			queryClient.invalidateQueries({ queryKey: ['balance'] });

			toast.success('Счёт успешно создан!', toastOptions);
			onClose();
		} catch (error) {
			console.error('Ошибка при создании счёта:', error);
			toast.error('Ошибка при создании счёта', toastOptions);
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
