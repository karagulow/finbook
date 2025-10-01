import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Controller, useForm } from 'react-hook-form';

import { Button, Input, Select } from '@/src/shared/ui';
import {
	CreateAccountModalContentProps,
	Currency,
	FormValues,
} from '../model/types';

import { toastOptions } from '@/src/shared/lib';

export const CreateAccountModalContent: React.FC<
	CreateAccountModalContentProps
> = ({ onClose }) => {
	const [currencies, setCurrencies] = useState<Currency[]>([]);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormValues>();

	useEffect(() => {
		axios
			.get<Currency[]>('/api/currencies')
			.then(res => setCurrencies(res.data));
	}, []);

	const onSubmit = async (data: FormValues) => {
		try {
			await axios.post('/api/accounts', {
				...data,
				amount: Number(data.amount),
			});
			toast.success('Счёт успешно создан!', toastOptions);
			onClose();
		} catch (error) {
			console.error('Ошибка при создании счёта:', error);
			toast.error('Ошибка при создании счёта', toastOptions);
		}
	};

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
