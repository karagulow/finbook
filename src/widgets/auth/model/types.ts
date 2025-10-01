export type LoginFormData = {
	email: string;
	password: string;
};

export type RegistrationFormData = {
	email: string;
	password: string;
	confirmPassword: string;
	currencyId: string;
};

export type ForgotPasswordFormData = {
	email: string;
};

export type ResetPasswordFormData = {
	password: string;
	confirmPassword: string;
};

export type Currency = {
	id: string;
	code: string;
	name: string;
	symbol?: string | null;
};
