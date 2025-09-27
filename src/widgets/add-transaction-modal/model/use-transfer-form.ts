'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import toast from 'react-hot-toast';

import { toastOptions } from '@/src/shared/lib';
import { TransferFormData, transferValidation } from './validations';

export const useTransferForm = (onClose: () => void) => {
	const [loading, setLoading] = useState(false);
	const [accounts, setAccounts] = useState<any[]>([]);
	const [currencies, setCurrencies] = useState<any[]>([]);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<TransferFormData>({
		resolver: yupResolver(transferValidation) as any,
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
			toast.success('Трансфер успешно добавлен!', toastOptions);
			onClose();
		} catch (error: any) {
			toast.error(
				error.response?.data?.error || 'Ошибка при добавлении трансфера',
				toastOptions
			);
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
