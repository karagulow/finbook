'use client';

import React from 'react';
import { Controller } from 'react-hook-form';

import { DebtType } from '@/src/entities/debt';
import {
	Button,
	CurrencyInput,
	DatePicker,
	Input,
	Tabs,
	Textarea,
} from '@/src/shared/ui';
import { EditDebtModalContentProps } from '../model/types';
import { useEditDebtForm } from '../model/use-edit-debt-form';

const debtTabs = ['Я должен', 'Мне должны'] as const;

const debtTypeByTab: Record<(typeof debtTabs)[number], DebtType> = {
	'Я должен': 'OWED_BY_ME',
	'Мне должны': 'OWED_TO_ME',
};

const tabByDebtType: Record<DebtType, (typeof debtTabs)[number]> = {
	OWED_BY_ME: 'Я должен',
	OWED_TO_ME: 'Мне должны',
};

export const EditDebtModalContent: React.FC<EditDebtModalContentProps> = ({
	onClose,
	debt,
	currency,
}) => {
	const { control, handleSubmit, errors, isSubmitting, onSubmit } =
		useEditDebtForm(onClose, debt);

	return (
		<form
			className='flex flex-col gap-5 h-full'
			onSubmit={handleSubmit(onSubmit)}
		>
			<h2 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
				Редактировать долг
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
							tabName='edit-debt-type'
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
					name='targetAmount'
					render={({ field }) => (
						<CurrencyInput
							label='Сумма долга'
							placeholder={`0 ${currency}`}
							suffix={currency ? ` ${currency}` : undefined}
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
				{isSubmitting ? 'Сохранение...' : 'Сохранить'}
			</Button>
		</form>
	);
};
