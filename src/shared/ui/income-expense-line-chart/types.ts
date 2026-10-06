export type LineChartCategory = {
	name: string;
	amount: number;
};

export type LineChartPoint = {
	label: string;
	income: number;
	expense: number;
	categories?: LineChartCategory[];
};

export type IncomeExpenseLineChartProps = {
	title: string;
	dataPoints: LineChartPoint[] | null;
	difference: number;
	currency: string;
	year: number;
};

export type LineChartTooltipDetails = {
	dataPoints: LineChartPoint[];
	accumulated: number[];
	currency: string;
	year: number;
	yearExpense: number;
};
