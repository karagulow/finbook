'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button, DatePicker, Input, Select, Textarea } from '@/src/shared/ui';
import { toastOptions } from '@/src/shared/lib';
import {
	TransactionFormData,
	transactionValidation,
} from '../model/validations';
import { Account, Category, Subcategory, Transaction } from '../model/types';

interface Props {
	type: 'INCOME' | 'EXPENSE';
	onClose: () => void;
	transaction: Transaction;
}

export const TransactionForm: React.FC<Props> = ({
	type,
	onClose,
	transaction,
}) => {
	const [loading, setLoading] = useState(false);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<TransactionFormData>({
		resolver: yupResolver(
			transactionValidation
		) as Resolver<TransactionFormData>,
		defaultValues: {
			amount: transaction.amount,
			date: new Date(transaction.date),
			accountId: transaction.account?.id,
			categoryId: transaction.category?.id,
			subcategoryId: transaction.subcategory?.id,
			description: transaction.description,
		},
	});

	const selectedCategoryId = watch('categoryId');

	useEffect(() => {
		axios.get('/api/accounts').then(res => setAccounts(res.data));
		axios.get('/api/categories').then(res => setCategories(res.data));
	}, []);

	useEffect(() => {
		const category = categories.find(c => c.id === selectedCategoryId);
		if (category) {
			setSubcategories(category.subcategories);
		} else {
			setSubcategories([]);
		}
	}, [selectedCategoryId, categories]);

	const onSubmit = async (data: TransactionFormData) => {
		if (!navigator.onLine) {
			toast.error('Нет соединения с интернетом', toastOptions);
			return;
		}

		setLoading(true);
		try {
			await axios.put(`/api/transactions/${transaction.id}`, {
				...data,
				type,
			});

			onClose();
			toast.success('Транзакция обновлена!', toastOptions);
		} catch (error: unknown) {
			let message = 'Ошибка при обновлении транзакции';

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

	return (
		<form
			className='flex flex-col gap-5 h-full'
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className='flex flex-col gap-5 flex-1 overflow-y-auto'>
				<Input
					label='Сумма'
					type='number'
					step='any'
					{...register('amount')}
					error={errors.amount?.message}
				/>
				<DatePicker
					label='Дата'
					value={watch('date')}
					onChange={date => setValue('date', date)}
					error={errors.date?.message}
				/>
				<Select
					label='Счёт'
					placeholder='Выберите счёт'
					options={accounts.map(acc => ({
						value: acc.id,
						label: `${acc.name}`,
					}))}
					value={watch('accountId')}
					onChange={val => setValue('accountId', val)}
					error={errors.accountId?.message}
				/>
				<Select
					label='Категория'
					placeholder='Выберите категорию'
					options={categories
						.filter(c => c.type === type)
						.map(cat => ({ value: cat.id, label: cat.name }))}
					value={watch('categoryId')}
					onChange={val => setValue('categoryId', val)}
					error={errors.categoryId?.message}
				/>
				<Select
					label='Подкатегория'
					placeholder='Выберите подкатегорию'
					options={subcategories.map(sub => ({
						value: sub.id,
						label: sub.name,
					}))}
					value={watch('subcategoryId')}
					onChange={val => setValue('subcategoryId', val)}
					error={errors.subcategoryId?.message}
				/>
				<Textarea
					label='Описание'
					placeholder='Введите описание'
					{...register('description')}
					error={errors.description?.message}
				/>
			</div>

			<Button type='submit' disabled={loading}>
				{loading ? 'Загрузка...' : 'Сохранить'}
			</Button>
		</form>
	);
};
