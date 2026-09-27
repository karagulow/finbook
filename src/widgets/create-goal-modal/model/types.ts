export interface CreateGoalFormValues {
	name: string;
	icon: string;
	targetAmount: string;
	deadline: Date;
	description: string;
}

export interface CreateGoalModalContentProps {
	onClose: () => void;
	currency: string;
}
