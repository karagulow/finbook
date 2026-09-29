'use client';

import React from 'react';
import { Controller } from 'react-hook-form';

import { Button, CurrencyInput, DatePicker, Textarea } from '@/src/shared/ui';
import { DebtOperationTarget } from '../model/types';
import { useDebtOperationForm } from '../model/use-debt-operation-form';

interface Props {
	debt: DebtOperationTarget;
	currency: string;
	onClose: () => void;
}

const formatAmount = (value: number) =>
	value.toLocaleString('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

const roundMoney = (value: number) => Math.round(value * 100) / 100;

export const DebtOperationModalContent: React.FC<Props> = ({
	debt,
	currency,
	onClose,
}) => {
	const remaining = roundMoney(
		Math.max(0, debt.targetAmount - debt.savedAmount),
	);
	const progress =
		debt.targetAmount > 0 ? (debt.savedAmount / debt.targetAmount) * 100 : 0;
	const clamped = Math.min(100, Math.max(0, progress));

	const {
		control,
		handleSubmit,
		errors,
		isSubmitting,
		isReceive,
		onSubmit,
	} = useDebtOperationForm({
		debtId: debt.id,
		debtType: debt.type,
		remaining,
		onClose,
	});

	return (
		<form
			className='flex h-full flex-col gap-5'
			onSubmit={handleSubmit(onSubmit)}
		>
			<h2 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
				{isReceive ? 'Получить возврат' : 'Вернуть долг'}
			</h2>

			<div className='flex flex-1 flex-col gap-5 overflow-y-auto'>
				<div className='flex flex-col items-center gap-3'>
					<span className='text-center font-semibold text-[20px] text-[var(--foreground-primary)]'>
						{formatAmount(debt.savedAmount)}
						<span className='font-medium text-[var(--foreground-secondary)]'>
							{' '}
							/ {formatAmount(debt.targetAmount)} {currency}
						</span>
					</span>

					<div className='h-1 w-full overflow-hidden rounded-full bg-[var(--border-primary-hover)]'>
						<div
							className='h-full rounded-full bg-[var(--foreground-primary)]'
							style={{ width: `${clamped}%` }}
						/>
					</div>

					<span className='font-medium text-[15px] text-[var(--foreground-primary)]'>
						{debt.name}
					</span>

					<span className='max-w-[240px] text-center font-medium text-[13px] leading-5 text-[var(--foreground-secondary)]'>
						{isReceive ? 'Осталось получить:' : 'Осталось вернуть:'}
						<br />
						{formatAmount(remaining)} {currency}
					</span>
				</div>

				<Controller
					control={control}
					name='amount'
					render={({ field }) => (
						<CurrencyInput
							label='Сумма'
							placeholder={`0 ${currency}`}
							prefix={isReceive ? '+ ' : '- '}
							suffix={currency ? ` ${currency}` : undefined}
							value={field.value}
							onValueChange={field.onChange}
							error={errors.amount?.message}
						/>
					)}
				/>

				<Controller
					control={control}
					name='date'
					render={({ field }) => (
						<DatePicker
							label='Дата'
							value={field.value}
							onChange={field.onChange}
							error={errors.date?.message}
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

			<Button type='submit' disabled={isSubmitting || remaining <= 0}>
				{isSubmitting
					? isReceive
						? 'Получение...'
						: 'Возврат...'
					: isReceive
						? 'Получить'
						: 'Вернуть'}
			</Button>
		</form>
	);
};
