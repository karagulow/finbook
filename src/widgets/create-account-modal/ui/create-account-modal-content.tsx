'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import { Button, Input, Select } from '@/src/shared/ui';
import { CreateAccountModalContentProps } from '../model/types';
import { useCreateAccountForm } from '../model/use-create-account-form';

export const CreateAccountModalContent: React.FC<
	CreateAccountModalContentProps
> = ({ onClose }) => {
	const { register, handleSubmit, control, errors, currencies, onSubmit } =
		useCreateAccountForm(onClose);

	return (
		<form className='flex h-full flex-col' onSubmit={handleSubmit(onSubmit)}>
			<h2 className='mb-5 font-bold text-[17px] text-[var(--foreground-primary)]'>
				Создать счёт
			</h2>

			<div className='flex flex-col gap-5 flex-1 overflow-y-auto'>
				<Input
					label='Название'
					placeholder='Введите название счёта'
					{...register('name', { required: 'Введите название' })}
					error={errors.name?.message}
				/>

				<Controller
					name='currencyId'
					control={control}
					rules={{ required: 'Выберите валюту' }}
					render={({ field, fieldState }) => (
						<Select
							label='Валюта'
							placeholder='Выберите валюту'
							value={field.value}
							onChange={field.onChange}
							error={fieldState.error?.message}
							options={currencies.map(c => ({
								value: c.id,
								label: `${c.name} (${c.code})`,
							}))}
						/>
					)}
				/>

				<Input
					label='Остаток'
					placeholder='0'
					type='number'
					{...register('amount', {
						required: 'Введите сумму',
						valueAsNumber: true,
					})}
					error={errors.amount?.message}
				/>
			</div>

			<Button className='mt-5 shrink-0' type='submit'>
				Создать
			</Button>
		</form>
	);
};
