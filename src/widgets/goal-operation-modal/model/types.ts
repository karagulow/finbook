export type GoalOperationType = 'DEPOSIT' | 'WITHDRAW';

export interface GoalOperationFormValues {
	amount: string;
	date: Date;
	description: string;
}

export interface GoalOperationTarget {
	id: string;
	name: string;
	icon: string;
	savedAmount: number;
	targetAmount: number;
}

export interface GoalOperationInitial {
	id: string;
	amount: number;
	date: string;
	description: string | null;
}
