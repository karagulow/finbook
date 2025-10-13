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
					.trim()
					.min(1, 'Название подкатегории не может быть пустым')
					.required('Введите название подкатегории'),
			})
		)
		.required()
		.default([]),
});

function getRandomColor() {
	const colors = [
		'#FF9800',
		'#4CAF50',
		'#2196F3',
		'#9C27B0',
		'#F44336',
		'#009688',
		'#3F51B5',
		'#E91E63',
		'#00BCD4',
	];
	return colors[Math.floor(Math.random() * colors.length)];
}

export const CreateCategoryContent: React.FC<Props> = ({ onClose }) => {
	const randomColor = useMemo(() => getRandomColor(), []);

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: yupResolver(schema),
		defaultValues: {
			name: '',
			type: 'EXPENSE',
			icon: '💰',
			color: randomColor,
			subcategories: [],
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

			await axios.post('/api/categories', payload);
			toast.success('Категория успешно создана!');
			onClose();
		} catch (err: unknown) {
			let message = 'Ошибка при создании категории';

			if (axios.isAxiosError(err)) {
				message = err.response?.data?.message || err.message || message;
			} else if (err instanceof Error) {
				message = err.message;
			}

			console.error('Ошибка при создании категории:', err);
			toast.error(message);
		}
	};

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
