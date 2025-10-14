'use client';

import { useEffect, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { toastOptions } from '@/src/shared/lib';
import { TransferFormData, transferValidation } from './validations';
import { Account, Currency } from './types';

export const useTransferForm = (onClose: () => void) => {
	const [loading, setLoading] = useState(false);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [currencies, setCurrencies] = useState<Currency[]>([]);

	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<TransferFormData>({
		resolver: yupResolver(transferValidation) as Resolver<TransferFormData>,
		defaultValues: {
			date: new Date(),
		},
	});

	const accountIdFrom = watch('accountIdFrom');
	const accountIdTo = watch('accountIdTo');

	useEffect(() => {
		axios.get('/api/accounts').then(res => setAccounts(res.data));
		axios.get('/api/currencies').then(res => setCurrencies(res.data));
	}, []);

	useEffect(() => {
		if (accountIdFrom && accountIdTo && accountIdFrom !== accountIdTo) {
			const accFrom = accounts.find(a => a.id === accountIdFrom);
			const accTo = accounts.find(a => a.id === accountIdTo);

			if (accFrom && accTo && accFrom.currencyId !== accTo.currencyId) {
				axios
					.get(
						`/api/exchange-rate?from=${accFrom.currencyId}&to=${accTo.currencyId}`
					)
					.then(res => {
						if (res.data?.rate) {
							setValue('rate', res.data.rate);
						} else {
							setValue('rate', undefined);
						}
					})
					.catch(() => {
						toast.error('Не удалось загрузить курс валют', toastOptions);
					});
			} else {
				setValue('rate', 1);
			}
		}
	}, [accountIdFrom, accountIdTo, accounts, setValue]);

	const onSubmit = async (data: TransferFormData) => {
		if (!navigator.onLine) {
			toast.error('Нет соединения с интернетом', toastOptions);
			return;
		}

		setLoading(true);
		try {
			await axios.post('/api/transfers', data);
			queryClient.invalidateQueries({ queryKey: ['transactions'] });
			toast.success('Перевод успешно добавлен!', toastOptions);
			onClose();
		} catch (error: unknown) {
			let message = 'Ошибка при добавлении перевода';

			if (axios.isAxiosError(error)) {
				message = error.response?.data?.message || error.message || message;
			} else if (error instanceof Error) {
				message = error.message;
			}

			toast.error(message, toastOptions);
		} finally {
			setLoading(false);
		}
	};

	return {
		register,
		handleSubmit,
		onSubmit,
		watch,
		setValue,
		errors,
		loading,
		accounts,
		currencies,
	};
};
