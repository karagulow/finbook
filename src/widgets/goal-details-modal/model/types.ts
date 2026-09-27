export interface GoalOperation {
	id: string;
	amount: number;
	type: 'DEPOSIT' | 'WITHDRAW';
	date: string;
}

export interface GoalDetails {
	id: string;
	name: string;
	icon: string;
	savedAmount: number;
	targetAmount: number;
	deadline: string;
	description: string | null;
	operations: GoalOperation[];
}
