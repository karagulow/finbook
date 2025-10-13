export interface TransactionFormData {
	amount: number;
	accountId: string;
	categoryId: string;
	subcategoryId?: string;
	date: Date;
	description?: string;
}

export interface Account {
	id: string;
	name: string;
	balance: number;
	currencyId: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Currency {
	id: string;
	code: string;
	name: string;
	symbol: string | null;
}

export interface Subcategory {
	id: string;
	name: string;
	categoryId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Category {
	id: string;
	name: string;
	type: 'EXPENSE' | 'INCOME';
	icon: string;
	color: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
	subcategories: Subcategory[];
}
