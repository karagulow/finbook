'use client';

import React from 'react';
import { Controller } from 'react-hook-form';

import { Button, CurrencyInput, DatePicker, Textarea } from '@/src/shared/ui';
import { GoalDetailsProgress } from '@/src/widgets/goal-details-modal/ui/goal-details-progress';
import {
	GoalOperationInitial,
	GoalOperationTarget,
	GoalOperationType,
} from '../model/types';
import { useGoalOperationForm } from '../model/use-goal-operation-form';

interface Props {
	goal: GoalOperationTarget;
	type: GoalOperationType;
	currency: string;
	operation?: GoalOperationInitial;
	onClose: () => void;
}

const formatAmount = (value: number) =>
	value.toLocaleString('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

const roundMoney = (value: number) => Math.round(value * 100) / 100;

export const GoalOperationModalContent: React.FC<Props> = ({
	goal,
	type,
	currency,
	operation,
	onClose,
}) => {
	const isDeposit = type === 'DEPOSIT';
	const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
	const availableToWithdraw =
		goal.savedAmount + (type === 'WITHDRAW' ? (operation?.amount ?? 0) : 0);
	const minimumAmount =
		operation && isDeposit
			? Math.max(0, roundMoney(operation.amount - goal.savedAmount))
			: 0;
	const progress =
		goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;

	const { control, handleSubmit, errors, isSubmitting, isEdit, onSubmit } =
		useGoalOperationForm({
			goalId: goal.id,
			type,
			availableAmount: isDeposit ? goal.savedAmount : availableToWithdraw,
			minimumAmount,
			operation,
			onClose,
		});

	return (
		<form
			className='flex h-full flex-col gap-5'
			onSubmit={handleSubmit(onSubmit)}
		>
			<h2 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
				{isEdit
					? isDeposit
						? 'Изменить пополнение'
						: 'Изменить снятие'
					: isDeposit
						? 'Пополнить цель'
						: 'Снять средства'}
			</h2>

			<div className='flex flex-1 flex-col gap-5 overflow-y-auto'>
				<div className='flex flex-col items-center gap-3'>
					<GoalDetailsProgress icon={goal.icon} progress={progress} />

					<span className='text-center font-semibold text-[20px] text-[var(--foreground-primary)]'>
						{formatAmount(goal.savedAmount)}
						<span className='font-medium text-[var(--foreground-secondary)]'>
							{' '}
							/ {formatAmount(goal.targetAmount)} {currency}
						</span>
					</span>

					<span className='font-medium text-[15px] text-[var(--foreground-primary)]'>
						{goal.name}
					</span>

					<span className='max-w-[240px] text-center font-medium text-[13px] leading-5 text-[var(--foreground-secondary)]'>
						{isDeposit ? (
							<>
								До выполнения цели осталось:
								<br />
								{formatAmount(remaining)} {currency}
							</>
						) : (
							<>
								Сумма, которую можно снять:
								<br />
								{formatAmount(availableToWithdraw)} {currency}
							</>
						)}
					</span>
				</div>

				<Controller
					control={control}
					name='amount'
					render={({ field }) => (
						<CurrencyInput
							label='Сумма'
							placeholder={`0 ${currency}`}
							prefix={isDeposit ? '+ ' : '- '}
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

			<Button type='submit' disabled={isSubmitting}>
				{isSubmitting
					? isEdit
						? 'Сохранение...'
						: isDeposit
							? 'Пополнение...'
							: 'Снятие...'
					: isEdit
						? 'Сохранить'
						: isDeposit
							? 'Пополнить'
							: 'Снять'}
			</Button>
		</form>
	);
};
