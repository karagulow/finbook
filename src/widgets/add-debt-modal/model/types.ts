import { DebtType } from '@/src/entities/debt';

export interface AddDebtFormValues {
	type: DebtType;
	name: string;
	accountId: string;
	targetAmount: string;
	deadline: Date;
	description: string;
}

export interface DebtAccountOption {
	id: string;
	name: string;
	currencyCode: string;
	currencySymbol: string | null;
}

export interface AddDebtModalContentProps {
	onClose: () => void;
	currency: string;
	initialType: DebtType;
}
