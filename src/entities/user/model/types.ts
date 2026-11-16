export interface Currency {
	id: string;
	name: string;
	code: string;
	symbol?: string;
}

export interface User {
	id: string;
	email: string;
	currency: Currency;
	createdAt: string;
	updatedAt: string;
}
