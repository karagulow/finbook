'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { TransactionFormData } from '../model/types';
import { transactionValidation } from '../model/validations';
import { toastOptions } from '@/src/shared/lib';
import { Button, DatePicker, Input, Select, Textarea } from '@/src/shared/ui';

interface Props {
	type: 'INCOME' | 'EXPENSE';
	onClose: () => void;
}

export const TransactionForm: React.FC<Props> = ({ type, onClose }) => {
	const [loading, setLoading] = useState(false);
	const [accounts, setAccounts] = useState<any[]>([]);
	const [categories, setCategories] = useState<any[]>([]);
	const [subcategories, setSubcategories] = useState<any[]>([]);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<TransactionFormData>({
		resolver: yupResolver(transactionValidation) as any,
		defaultValues: {
			date: new Date(),
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
			await axios.post('/api/transactions', {
				...data,
				type,
			});

			onClose();
			toast.success('Транзакция добавлена!', toastOptions);
		} catch (error: any) {
			toast.error(
				error.response?.data?.message || 'Ошибка при добавлении транзакции',
				toastOptions
			);
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
				{loading ? 'Загрузка...' : 'Добавить'}
			</Button>
		</form>
	);
};
