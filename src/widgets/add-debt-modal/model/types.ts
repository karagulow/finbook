import { DebtType } from '@/src/entities/debt';

export interface AddDebtFormValues {
	type: DebtType;
	name: string;
	targetAmount: string;
	deadline: Date;
	description: string;
}

export interface AddDebtModalContentProps {
	onClose: () => void;
	currency: string;
	initialType: DebtType;
}
