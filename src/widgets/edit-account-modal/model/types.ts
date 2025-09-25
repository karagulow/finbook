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

export type Account = {
	id: string;
	name: string;
	balance: number;
	currencyId: string;
};

export interface EditAccountModalContentProps {
	onClose: () => void;
	account: Account;
}
