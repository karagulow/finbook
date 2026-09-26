export type GoalStatus = 'active' | 'achieved';

export interface Goal {
	id: string;
	name: string;
	icon: string;
	savedAmount: number;
	targetAmount: number;
	deadline: string;
	status: GoalStatus;
}
