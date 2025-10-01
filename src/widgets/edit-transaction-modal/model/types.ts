export type Transaction = {
	id: string;
	type: string;
	date: string;
	description?: string;
	category?: { id: string; name: string; icon: string };
	subcategory?: { id: string; name: string };
	amount?: number;
	amountFrom?: number;
	amountTo?: number;
	account?: {
		id: string;
		name: string;
		currency: { code: string; symbol: string | null };
	};
	accountFrom?: {
		id: string;
		name: string;
		currency: {
			id: string;
			code: string;
			symbol: string | null;
		};
	};
	accountTo?: {
		id: string;
		name: string;
		currency: {
			id: string;
			code: string;
			symbol: string | null;
		};
	};
};
