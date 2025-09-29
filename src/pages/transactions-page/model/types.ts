export interface Transaction {
	id: string;
	type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
	amount: number;
	date: string;
	description?: string;
	category?: { name: string };
	subcategory?: { name: string };
	account?: { name: string };
}

export interface DayGroup {
	date: string;
	income: number;
	expense: number;
	transactions: Transaction[];
}
