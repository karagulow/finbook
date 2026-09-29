'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { endOfMonth } from 'date-fns';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { DebtType } from '@/src/entities/debt';
import { api, toastOptions } from '@/src/shared/lib';
import { AddDebtFormValues, DebtAccountOption } from './types';

const schema: yup.ObjectSchema<AddDebtFormValues> = yup.object({
	type: yup
		.mixed<DebtType>()
		.oneOf(['OWED_BY_ME', 'OWED_TO_ME'])
		.required('Выберите тип долга'),
	name: yup.string().trim().required('Укажите, кто занял'),
	accountId: yup.string().required('Выберите счёт'),
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
	const [accounts, setAccounts] = useState<DebtAccountOption[]>([]);
	const [accountsLoaded, setAccountsLoaded] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		setValue,
		watch,
	} = useForm<AddDebtFormValues>({
		resolver: yupResolver(schema),
		defaultValues: {
			type: initialType,
			name: '',
			accountId: '',
			targetAmount: '',
			deadline: endOfMonth(new Date()),
			description: '',
		},
	});

	useEffect(() => {
		const loadAccounts = async () => {
			try {
				const [accountsRes, currenciesRes] = await Promise.all([
					api.get<{ id: string; name: string; currencyId: string }[]>(
						'/api/accounts',
					),
					api.get<
						{ id: string; code: string; symbol: string | null }[]
					>('/api/currencies'),
				]);
				const currencies = new Map(
					currenciesRes.data.map(currency => [currency.id, currency]),
				);

				setAccounts(
					accountsRes.data.map(account => {
						const currency = currencies.get(account.currencyId);

						return {
							id: account.id,
							name: account.name,
							currencyCode: currency?.code ?? '',
							currencySymbol: currency?.symbol ?? null,
						};
					}),
				);
			} catch (error) {
				console.error(error);
			} finally {
				setAccountsLoaded(true);
			}
		};

		loadAccounts();
	}, []);

	useEffect(() => {
		if (accounts.length === 1) {
			setValue('accountId', accounts[0].id);
		}
	}, [accounts, setValue]);

	const onSubmit = async (data: AddDebtFormValues) => {
		try {
			await api.post('/api/debts', {
				type: data.type,
				name: data.name.trim(),
				targetAmount: Number(data.targetAmount),
				accountId: data.accountId,
				deadline: data.deadline.toISOString(),
				description: data.description.trim() || null,
			});

			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ['debts'] }),
				queryClient.invalidateQueries({ queryKey: ['accounts'] }),
				queryClient.invalidateQueries({ queryKey: ['balance'] }),
			]);
			toast.success('Долг успешно добавлен!', toastOptions);
			reset({
				type: initialType,
				name: '',
				accountId: accounts.length === 1 ? accounts[0].id : '',
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
		accounts,
		accountsLoaded,
		watch,
		onSubmit,
	};
};
