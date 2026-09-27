export interface EditGoalFormValues {
	name: string;
	icon: string;
	targetAmount: string;
	deadline: Date;
	description: string;
}

export interface EditableGoal {
	id: string;
	name: string;
	icon: string;
	targetAmount: number;
	deadline: string;
	description: string | null;
}

export interface EditGoalModalContentProps {
	onClose: () => void;
	goal: EditableGoal;
	currency: string;
}
