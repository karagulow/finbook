'use client';

import React, { useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { Button, Input, Select } from '@/src/shared/ui';
import { EmojiPicker } from './emoji-picker';
import { Subcategories } from './subcategories';

interface SubcategoryForm {
	name: string;
}

export interface FormValues {
	name: string;
	type: 'EXPENSE' | 'INCOME';
	icon: string;
	color: string;
	subcategories: SubcategoryForm[];
}

interface Props {
	onClose: () => void;
	category: {
		id: string;
		name: string;
		type: 'EXPENSE' | 'INCOME';
		icon: string;
		color: string;
		subcategories: SubcategoryForm[];
	};
}

const schema: yup.ObjectSchema<FormValues> = yup.object({
	name: yup.string().required('Введите название категории'),
	type: yup
		.mixed<'EXPENSE' | 'INCOME'>()
		.oneOf(['EXPENSE', 'INCOME'])
		.required(),
	icon: yup.string().required('Выберите эмодзи'),
	color: yup.string().required(),
	subcategories: yup
		.array(
			yup.object({
				name: yup
					.string()
					.required('Введите название подкатегории')
					.trim()
					.min(1, 'Название подкатегории не может быть пустым'),
			})
		)
		.default([]),
});

export const EditCategoryContent: React.FC<Props> = ({ onClose, category }) => {
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<FormValues>({
		resolver: yupResolver(schema),
		defaultValues: {
			name: category.name,
			type: category.type,
			icon: category.icon,
			color: category.color,
			subcategories: category.subcategories || [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'subcategories',
	});

	const onSubmit = async (data: FormValues) => {
		try {
			const payload = {
				...data,
				subcategories: data.subcategories.map(s => s.name).filter(Boolean),
			};

			await axios.put(`/api/categories/${category.id}`, payload);
			toast.success('Категория успешно обновлена!');
			onClose();
		} catch (err: any) {
			console.error('Ошибка при редактировании категории:', err);
			toast.error(
				err.response?.data?.message || 'Ошибка при редактировании категории'
			);
		}
	};

	return (
		<form
			className='flex flex-col gap-5 h-full'
			onSubmit={handleSubmit(onSubmit)}
		>
			<h2 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
				Редактировать категорию
			</h2>

			<div className='flex flex-col gap-5 flex-1 overflow-y-auto'>
				<Controller
					control={control}
					name='icon'
					render={({ field }) => (
						<EmojiPicker
							className='self-center'
							selectedEmoji={field.value}
							onSelect={field.onChange}
						/>
					)}
				/>
				{errors.icon && (
					<p className='text-[13px] text-red-500'>{errors.icon.message}</p>
				)}

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

				<Subcategories
					control={control}
					fields={fields}
					append={append}
					remove={remove}
				/>
			</div>

			<Button type='submit' disabled={isSubmitting || !isDirty}>
				{isSubmitting ? 'Сохранение...' : 'Сохранить'}
			</Button>
		</form>
	);
};
