import * as yup from 'yup';

export const loginValidation = yup.object({
	email: yup
		.string()
		// .matches(/^[^\s@]+@[^\s@]+\.[A-Za-z0-9\-]{2,}$/, 'Неверный email')
		.required('Email обязателен'),
	password: yup
		.string()
		.min(8, 'Минимум 8 символов')
		.required('Пароль обязателен'),
});

export const registrationValidation = yup.object({
	email: yup
		.string()
		.matches(/^[^\s@]+@[^\s@]+\.[A-Za-z0-9\-]{2,}$/, 'Неверный email')
		.required('Email обязателен'),
	password: yup
		.string()
		.min(8, 'Минимум 8 символов')
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]*$/,
			'Пароль должен содержать заглавные и строчные буквы, цифры и специальные символы, без пробелов'
		)
		.required('Пароль обязателен'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password')], 'Пароли не совпадают')
		.required('Подтверждение пароля обязательно'),
	currencyId: yup.string().required('Валюта обязательна'),
});
