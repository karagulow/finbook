export type Category = {
	id: string;
	name: string;
	amount: number;
	color: string;
};

export type CategoryDoughnutChartProps = {
	title: string;
	categories: Category[] | null;
};

export type CategoryDoughnutTooltipDetails = {
	title: string;
	categories: Category[];
	total: number;
};
