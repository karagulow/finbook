export type DebtType = 'OWED_BY_ME' | 'OWED_TO_ME';

export interface DebtOperation {
	id: string;
	amount: number;
	date: string;
	description: string | null;
}

export interface Debt {
	id: string;
	name: string;
	savedAmount: number;
	targetAmount: number;
	deadline: string;
	paid: boolean;
	type: DebtType;
	description: string | null;
	accountId: string | null;
	accountName: string | null;
	currencyCode: string;
	currencySymbol: string | null;
	createdAt: string;
	operations: DebtOperation[];
}

export interface DebtsResponse {
	currencyCode: string;
	currencySymbol: string | null;
	debts: Debt[];
}
