export type Transaction = {
	id: string;
	type: string;
	date: string;
	description?: string;
	category?: { id: string; name: string; icon: string };
	subcategory?: { id: string; name: string };
	amount?: number;
	amountFrom?: number;
	amountTo?: number;
	account?: {
		id: string;
		name: string;
		currency: { code: string; symbol: string | null };
	};
	accountFrom?: {
		id: string;
		name: string;
		currency: {
			id: string;
			code: string;
			symbol: string | null;
		};
	};
	accountTo?: {
		id: string;
		name: string;
		currency: {
			id: string;
			code: string;
			symbol: string | null;
		};
	};
};

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
