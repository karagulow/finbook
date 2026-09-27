export interface GoalOperation {
	id: string;
	amount: number;
	type: 'DEPOSIT' | 'WITHDRAW';
	date: string;
	description: string | null;
}

export interface Goal {
	id: string;
	name: string;
	icon: string;
	savedAmount: number;
	targetAmount: number;
	deadline: string;
	description: string | null;
	operations: GoalOperation[];
}

export interface GoalsResponse {
	currencyCode: string;
	currencySymbol: string | null;
	goals: Goal[];
}
