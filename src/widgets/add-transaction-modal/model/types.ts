export interface TransactionFormData {
	amount: number;
	accountId: string;
	categoryId: string;
	subcategoryId?: string;
	date: Date;
	description?: string;
}
