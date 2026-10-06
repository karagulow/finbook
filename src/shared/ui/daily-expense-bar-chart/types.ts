export type DailyExpenseCategory = {
	name: string;
	amount: number;
};

export type DailyExpensePoint = {
	label: string;
	expense: number;
	categories?: DailyExpenseCategory[];
};

export type DailyExpenseBarChartProps = {
	dataPoints: DailyExpensePoint[] | null;
	difference: number;
	currency: string;
	year: number;
	month: number;
};

export type DailyExpenseTooltipDetails = {
	dataPoints: DailyExpensePoint[];
	currency: string;
	year: number;
	month: number;
	monthExpense: number;
};
