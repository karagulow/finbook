'use client';

import React from 'react';
import { Button, Input, Select } from '@/src/shared/ui';
import { EmojiPicker } from './emoji-picker';
import { Subcategories } from './subcategories';
import { Controller } from 'react-hook-form';
import { useCategoryForm } from '../../model/use-category-form';

export const CreateCategoryContent: React.FC<{ onClose: () => void }> = ({
	onClose,
}) => {
	const {
		control,
		handleSubmit,
		errors,
		isSubmitting,
		fields,
		append,
		remove,
		onSubmit,
	} = useCategoryForm({ mode: 'create', onClose });

	return (
		<form
			className='flex flex-col gap-5 h-full'
			onSubmit={handleSubmit(onSubmit)}
		>
			<h2 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
				Создать категорию
			</h2>

			<div className='flex flex-col gap-5 flex-1 overflow-y-auto'>
				<Controller
					control={control}
					name='icon'
					render={({ field }) => (
						<EmojiPicker
							className='self-center'
							onSelect={field.onChange}
							selectedEmoji={field.value}
						/>
					)}
				/>

				<Controller
					control={control}
					name='type'
					render={({ field }) => (
						<Select
							label='Тип категории'
							options={[
								{ value: 'EXPENSE', label: 'Расход' },
								{ value: 'INCOME', label: 'Доход' },
							]}
							value={field.value}
							onChange={field.onChange}
							error={errors.type?.message}
						/>
					)}
				/>

				<Controller
					control={control}
					name='name'
					render={({ field }) => (
						<Input
							label='Название категории'
							placeholder='Введите название категории'
							error={errors.name?.message}
							{...field}
						/>
					)}
				/>

				<Controller
					control={control}
					name='color'
					render={({ field }) => (
						<Input
							label='Цвет категории'
							type='color'
							error={errors.color?.message}
							value={field.value}
							onChange={field.onChange}
						/>
					)}
				/>

				<Subcategories
					fields={fields}
					append={append}
					remove={remove}
					control={control}
				/>
			</div>

			<Button type='submit' disabled={isSubmitting}>
				{isSubmitting ? 'Создание...' : 'Создать'}
			</Button>
		</form>
	);
};
