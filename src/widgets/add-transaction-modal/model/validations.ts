import * as yup from 'yup';
import { InferType } from 'yup';

export const transactionValidation = yup.object().shape({
	amount: yup
		.number()
		.typeError('Введите корректную сумму')
		.positive('Сумма должна быть больше 0')
		.required('Сумма обязательна'),
	accountId: yup.string().required('Счёт обязателен'),
	categoryId: yup.string().required('Категория обязательна'),
	subcategoryId: yup.string().nullable().optional(),
	date: yup.date().required('Дата обязательна'),
	description: yup.string().optional(),
});

export type TransactionFormData = InferType<typeof transactionValidation>;
