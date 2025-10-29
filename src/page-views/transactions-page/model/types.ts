export interface BaseTransaction {
	id: string;
	type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
	date: string;
	description?: string;
}

export interface IncomeExpenseTransaction extends BaseTransaction {
	type: 'INCOME' | 'EXPENSE';
	amount: number;
	category: { id: string; name: string; icon: string };
	subcategory?: { id: string; name: string };
	account: {
		id: string;
		name: string;
		currency: { code: string; symbol: string | null };
	};
}

export interface TransferTransaction extends BaseTransaction {
	type: 'TRANSFER';
	accountFrom: {
		id: string;
		name: string;
		currency: { id: string; code: string; symbol: string | null };
	};
	accountTo: {
		id: string;
		name: string;
		currency: { id: string; code: string; symbol: string | null };
	};
	amountFrom: number;
	amountTo: number;
}

export type Transaction = IncomeExpenseTransaction | TransferTransaction;

export interface DayGroup {
	date: string;
	income: number;
	expense: number;
	transactions: Transaction[];
}
