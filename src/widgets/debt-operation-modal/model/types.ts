import { DebtType } from '@/src/entities/debt';

export interface DebtOperationFormValues {
	amount: string;
	date: Date;
	description: string;
}

export interface DebtOperationTarget {
	id: string;
	name: string;
	type: DebtType;
	savedAmount: number;
	targetAmount: number;
}

export interface DebtOperationInitial {
	id: string;
	amount: number;
	date: string;
	description: string | null;
}
