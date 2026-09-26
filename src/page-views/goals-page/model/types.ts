export interface Goal {
	id: string;
	name: string;
	icon: string;
	savedAmount: number;
	targetAmount: number;
	deadline: string;
}

export interface GoalsResponse {
	currencyCode: string;
	currencySymbol: string | null;
	goals: Goal[];
}
