export type FormValues = {
	name: string;
	amount: number;
	currencyId: string;
};

export type Currency = {
	id: string;
	code: string;
	name: string;
	symbol?: string | null;
};

export interface CreateAccountModalContentProps {
	onClose: () => void;
}
