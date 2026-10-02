'use client';

import React from 'react';
import { Controller } from 'react-hook-form';

import {
	Button,
	CurrencyInput,
	DatePicker,
	EmojiPicker,
	Input,
	Textarea,
} from '@/src/shared/ui';
import { EditGoalModalContentProps } from '../model/types';
import { useEditGoalForm } from '../model/use-edit-goal-form';

export const EditGoalModalContent: React.FC<EditGoalModalContentProps> = ({
	onClose,
	goal,
	currency,
}) => {
	const { control, handleSubmit, errors, isSubmitting, onSubmit } =
		useEditGoalForm(onClose, goal);

	return (
		<form
			className='flex flex-col gap-5 h-full'
			onSubmit={handleSubmit(onSubmit)}
		>
			<h2 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
				Редактировать цель
			</h2>

			<div className='flex flex-col gap-5 flex-1 overflow-y-auto'>
				<Controller
					control={control}
					name='icon'
					render={({ field }) => (
						<div className='flex flex-col items-center gap-1.5'>
							<EmojiPicker
								className='self-center'
								onSelect={field.onChange}
								selectedEmoji={field.value}
							/>
							{errors.icon?.message && (
								<span className='font-semibold text-[11px] text-[var(--wrong)]'>
									{errors.icon.message}
								</span>
							)}
						</div>
					)}
				/>

				<Controller
					control={control}
					name='name'
					render={({ field }) => (
						<Input
							label='Название цели'
							placeholder='Введите название цели'
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
							label='Сумма для достижения цели'
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
							label='Дата окончания'
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
