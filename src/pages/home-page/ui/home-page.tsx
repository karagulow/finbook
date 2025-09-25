'use client';

import { useTransactionsByCategory } from '../hooks/use-transactions-by-category';

import {
	Button,
	CategoryDoughnutChart,
	CategoryDoughnutChartSkeleton,
	Dialog,
} from '@/src/shared/ui';
import { Balance } from '@/src/entities/balance';
import { AccountOverview } from '@/src/widgets/account-overview';

export const HomePage: React.FC = () => {
	const { incomes, expenses, loading } = useTransactionsByCategory();

	return (
		<>
			<div className='flex flex-col gap-5 sm:gap-[30px]'>
				<div className='flex flex-col items-start gap-2.5 sm:flex-row sm:justify-between sm:items-center'>
					<Balance />
					<Button className='w-full sm:w-auto'>Добавить транзакцию</Button>
				</div>

				<AccountOverview />

				<div className='grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7.5'>
					{loading ? (
						<>
							<CategoryDoughnutChartSkeleton />
							<CategoryDoughnutChartSkeleton />
						</>
					) : (
						<>
							<CategoryDoughnutChart title='Доходы' categories={incomes} />
							<CategoryDoughnutChart title='Расходы' categories={expenses} />
						</>
					)}
				</div>
			</div>
		</>
	);
};
