'use client';

import React from 'react';
import { Controller } from 'react-hook-form';

import { DebtType } from '@/src/entities/debt';
import {
	Button,
	CurrencyInput,
	DatePicker,
	Input,
	Select,
	Tabs,
	Textarea,
} from '@/src/shared/ui';
import { AddDebtModalContentProps } from '../model/types';
import { useAddDebtForm } from '../model/use-add-debt-form';

const debtTabs = ['Я должен', 'Мне должны'] as const;

const debtTypeByTab: Record<(typeof debtTabs)[number], DebtType> = {
	'Я должен': 'OWED_BY_ME',
	'Мне должны': 'OWED_TO_ME',
};

const tabByDebtType: Record<DebtType, (typeof debtTabs)[number]> = {
	OWED_BY_ME: 'Я должен',
	OWED_TO_ME: 'Мне должны',
};

export const AddDebtModalContent: React.FC<AddDebtModalContentProps> = ({
	onClose,
	currency,
	initialType,
}) => {
	const {
		control,
		handleSubmit,
		errors,
		isSubmitting,
		accounts,
		accountsLoaded,
		watch,
		onSubmit,
	} = useAddDebtForm(onClose, initialType);
	const debtType = watch('type');
	const selectedAccount = accounts.find(
		account => account.id === watch('accountId'),
	);
	const amountCurrency = selectedAccount
		? selectedAccount.currencySymbol || selectedAccount.currencyCode
		: currency;

	return (
		<form
			className='flex flex-col gap-5 h-full'
			onSubmit={handleSubmit(onSubmit)}
		>
			<h2 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
				Добавить долг
			</h2>

			<div className='flex flex-col gap-5 flex-1 overflow-y-auto'>
				<Controller
					control={control}
					name='type'
					render={({ field }) => (
						<Tabs
							items={[...debtTabs]}
							activeItem={tabByDebtType[field.value]}
							setActiveItem={item =>
								field.onChange(
									debtTypeByTab[item as (typeof debtTabs)[number]],
								)
							}
							tabName='add-debt-type'
						/>
					)}
				/>

				<Controller
					control={control}
					name='name'
					render={({ field }) => (
						<Input
							label='Кто занял'
							placeholder='Кто занял'
							error={errors.name?.message}
							{...field}
						/>
					)}
				/>

				<Controller
					control={control}
					name='accountId'
					render={({ field }) => (
						<Select
							label={
								debtType === 'OWED_TO_ME' ? 'Счёт списания' : 'Счёт пополнения'
							}
							placeholder='Выберите счёт'
							options={accounts.map(account => ({
								value: account.id,
								label: `${account.name} · ${
									account.currencySymbol || account.currencyCode
								}`,
							}))}
							value={field.value}
							onChange={field.onChange}
							error={errors.accountId?.message}
						/>
					)}
				/>

				{accountsLoaded && accounts.length === 0 && (
					<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
						Сначала добавьте счёт
					</p>
				)}

				<Controller
					control={control}
					name='targetAmount'
					render={({ field }) => (
						<CurrencyInput
							label='Сумма долга'
							placeholder={`0 ${amountCurrency}`}
							suffix={amountCurrency ? ` ${amountCurrency}` : undefined}
							value={field.value}
							onValueChange={field.onChange}
							error={errors.targetAmount?.message}
						/>
					)}
				/>

				<Controller
					control={control}
					name='deadline'
					render={({ field }) => (
						<DatePicker
							label='Дата возврата'
							value={field.value}
							onChange={field.onChange}
							displayFormat='d MMMM yyyy'
							error={errors.deadline?.message}
						/>
					)}
				/>

				<Controller
					control={control}
					name='description'
					render={({ field }) => (
						<Textarea
							label='Описание'
							placeholder='Введите текст'
							error={errors.description?.message}
							{...field}
						/>
					)}
				/>
			</div>

			<Button type='submit' disabled={isSubmitting}>
				{isSubmitting ? 'Добавление...' : 'Добавить'}
			</Button>
		</form>
	);
};
