export type AnalyticsTransaction = {
	id: string;
	type: 'INCOME' | 'EXPENSE';
	date: Date;
	amountInUserCurrency: number;
	category?: {
		id: string;
		name: string;
		color: string;
	};
};
