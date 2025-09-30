'use client';

import React from 'react';

import { Button, DatePicker, Input, Select, Textarea } from '@/src/shared/ui';
import { useTransferForm } from '../model/use-transfer-form';

interface Props {
	onClose: () => void;
}

export const TransferForm: React.FC<Props> = ({ onClose }) => {
	const {
		register,
		handleSubmit,
		onSubmit,
		watch,
		setValue,
		errors,
		loading,
		accounts,
		currencies,
	} = useTransferForm(onClose);

	const accountIdFrom = watch('accountIdFrom');
	const accountIdTo = watch('accountIdTo');

	return (
		<form
			className='flex flex-col gap-5 h-full'
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className='flex flex-col gap-5 flex-1 overflow-y-auto'>
				<Input
					label='Сумма'
					type='number'
					{...register('amountFrom')}
					error={errors.amountFrom?.message}
				/>

				<DatePicker
					label='Дата'
					value={watch('date')}
					onChange={date => setValue('date', date)}
					error={errors.date?.message}
				/>

				<Select
					label='Счёт списания'
					placeholder='Выберите счёт'
					options={accounts.map(acc => ({ value: acc.id, label: acc.name }))}
					value={watch('accountIdFrom')}
					onChange={val => setValue('accountIdFrom', val)}
					error={errors.accountIdFrom?.message}
				/>

				<Select
					label='Счёт зачисления'
					placeholder='Выберите счёт'
					options={accounts.map(acc => ({ value: acc.id, label: acc.name }))}
					value={watch('accountIdTo')}
					onChange={val => setValue('accountIdTo', val)}
					error={errors.accountIdTo?.message}
				/>

				{accountIdFrom &&
					accountIdTo &&
					accounts.find(a => a.id === accountIdFrom)?.currencyId !==
						accounts.find(a => a.id === accountIdTo)?.currencyId && (
						<Input
							label={`Курс (${
								currencies.find(
									c =>
										c.id ===
										accounts.find(a => a.id === accountIdFrom)?.currencyId
								)?.code
							} / ${
								currencies.find(
									c =>
										c.id ===
										accounts.find(a => a.id === accountIdTo)?.currencyId
								)?.code
							})`}
							type='number'
							step='0.0001'
							{...register('rate')}
							error={errors.rate?.message}
						/>
					)}

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
