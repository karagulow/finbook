import * as yup from 'yup';

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

export const transferValidation = yup.object().shape({
	amountFrom: yup
		.number()
		.positive('Сумма должна быть больше 0')
		.required('Введите сумму'),
	accountIdFrom: yup.string().required('Выберите счёт списания'),
	accountIdTo: yup.string().required('Выберите счёт зачисления'),
	rate: yup.number().optional(),
	date: yup.date().required(),
	description: yup.string().optional(),
});

export type TransactionFormData = yup.InferType<typeof transactionValidation>;
export type TransferFormData = yup.InferType<typeof transferValidation>;
