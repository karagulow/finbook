'use client';

import { useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export interface SubcategoryForm {
	name: string;
}

export interface FormValues {
	name: string;
	type: 'EXPENSE' | 'INCOME';
	icon: string;
	color: string;
	subcategories: SubcategoryForm[];
}

interface UseCategoryFormProps {
	mode: 'create' | 'edit';
	onClose: () => void;
	category?: {
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
					.trim()
					.min(1, 'Название подкатегории не может быть пустым')
					.required('Введите название подкатегории'),
			})
		)
		.default([]),
});

function getRandomColor() {
	const colors = [
		'#F4A261',
		'#A8DADC',
		'#457B9D',
		'#B5838D',
		'#E5989B',
		'#6D6875',
		'#84A59D',
		'#F6BD60',
		'#B5E48C',
	];
	return colors[Math.floor(Math.random() * colors.length)];
}

export const useCategoryForm = ({
	mode,
	onClose,
	category,
}: UseCategoryFormProps) => {
	const randomColor = useMemo(() => getRandomColor(), []);

	const isEdit = mode === 'edit';

	const queryClient = useQueryClient();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty },
		reset,
	} = useForm<FormValues>({
		resolver: yupResolver(schema),
		defaultValues: isEdit
			? {
					name: category?.name || '',
					type: category?.type || 'EXPENSE',
					icon: category?.icon || '💰',
					color: category?.color || randomColor,
					subcategories: category?.subcategories || [],
			  }
			: {
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

			if (isEdit && category) {
				await axios.put(`/api/categories/${category.id}`, payload);
				toast.success('Категория успешно обновлена!');
			} else {
				await axios.post('/api/categories', payload);
				toast.success('Категория успешно создана!');
			}

			queryClient.invalidateQueries({ queryKey: ['categories'] });

			onClose();
			reset();
		} catch (err: unknown) {
			let message = isEdit
				? 'Ошибка при редактировании категории'
				: 'Ошибка при создании категории';

			if (axios.isAxiosError(err)) {
				message = err.response?.data?.message || err.message || message;
			} else if (err instanceof Error) {
				message = err.message;
			}

			console.error(message, err);
			toast.error(message);
		}
	};

	return {
		control,
		handleSubmit,
		errors,
		isSubmitting,
		isDirty,
		fields,
		append,
		remove,
		onSubmit,
		isEdit,
	};
};
