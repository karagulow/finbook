'use client';

import React, { memo } from 'react';
import { Button, DatePicker, Input, Select, Textarea } from '@/src/shared/ui';
import { Transaction } from '../model/types';
import { useTransactionForm } from '../model/use-transaction-form';

interface Props {
	type: 'INCOME' | 'EXPENSE';
	onClose: () => void;
	transaction: Transaction;
}

const TransactionFormComponent: React.FC<Props> = ({
	type,
	onClose,
	transaction,
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		errors,
		onSubmit,
		loading,
		accounts,
		categories,
		subcategories,
	} = useTransactionForm(type, onClose, transaction);

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
					inputMode='decimal'
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
						label: acc.name,
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
				{loading ? 'Сохранение...' : 'Сохранить'}
			</Button>
		</form>
	);
};

TransactionFormComponent.displayName = 'TransactionForm';

export const TransactionForm = memo(TransactionFormComponent);
