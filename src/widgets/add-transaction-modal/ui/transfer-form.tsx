'use client';

import React, { memo } from 'react';
import { Controller } from 'react-hook-form';

import {
	Button,
	CurrencyInput,
	DatePicker,
	Select,
	Textarea,
} from '@/src/shared/ui';
import { useTransferForm } from '../model/use-transfer-form';

interface Props {
	onClose: () => void;
}

const TransferFormComponent: React.FC<Props> = ({ onClose }) => {
	const {
		register,
		control,
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

	const currencyFrom = accounts.find(a => a.id === accountIdFrom)?.currencyId;
	const currencyTo = accounts.find(a => a.id === accountIdTo)?.currencyId;

	return (
		<form
			className='flex flex-col gap-5 h-full'
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className='flex flex-col gap-5 flex-1 overflow-y-auto'>
				<Controller
					name='amountFrom'
					control={control}
					rules={{ required: 'Введите сумму' }}
					render={({ field, fieldState }) => (
						<CurrencyInput
							label='Сумма'
							placeholder='0,00'
							value={field.value}
							onValueChange={field.onChange}
							error={fieldState.error?.message}
						/>
					)}
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

				{accountIdFrom && accountIdTo && currencyFrom !== currencyTo && (
					<Controller
						name='rate'
						control={control}
						rules={{ required: 'Введите курс' }}
						render={({ field, fieldState }) => (
							<CurrencyInput
								label={`Курс (${
									currencies.find(c => c.id === currencyFrom)?.code
								} / ${currencies.find(c => c.id === currencyTo)?.code})`}
								value={field.value}
								onValueChange={field.onChange}
								error={fieldState.error?.message}
							/>
						)}
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
				{loading ? 'Добавление...' : 'Добавить'}
			</Button>
		</form>
	);
};

TransferFormComponent.displayName = 'TransferForm';

export const TransferForm = memo(TransferFormComponent);
