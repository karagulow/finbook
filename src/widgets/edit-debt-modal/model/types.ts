import { DebtType } from '@/src/entities/debt';

export interface EditDebtFormValues {
	type: DebtType;
	name: string;
	targetAmount: string;
	deadline: Date;
	description: string;
}

export interface EditableDebt {
	id: string;
	name: string;
	targetAmount: number;
	deadline: string;
	type: DebtType;
	description: string | null;
}

export interface EditDebtModalContentProps {
	onClose: () => void;
	debt: EditableDebt;
	currency: string;
}
