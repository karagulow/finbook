export type Transaction = {
	id: string;
	type: string;
	date: string;
	description?: string;
	category?: { name: string; icon: string };
	subcategory?: { name: string };
	amount?: number;
	amountFrom?: number;
	amountTo?: number;
	account?: {
		name: string;
		currency: { code: string; symbol: string | null };
	};
	accountFrom?: {
		name: string;
		currency: {
			id: string;
			code: string;
			symbol: string | null;
		};
	};
	accountTo?: {
		name: string;
		currency: {
			id: string;
			code: string;
			symbol: string | null;
		};
	};
};
