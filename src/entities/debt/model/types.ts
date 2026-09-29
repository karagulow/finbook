export type DebtType = 'OWED_BY_ME' | 'OWED_TO_ME';

export interface Debt {
	id: string;
	name: string;
	savedAmount: number;
	targetAmount: number;
	deadline: string;
	paid: boolean;
	type: DebtType;
	description: string | null;
	createdAt: string;
}

export interface DebtsResponse {
	currencyCode: string;
	currencySymbol: string | null;
	debts: Debt[];
}
