'use client';

import { useState } from 'react';

import { useTransactionsByCategory } from '../hooks/use-transactions-by-category';

import {
	Button,
	CategoryDoughnutChart,
	CategoryDoughnutChartSkeleton,
} from '@/src/shared/ui';
import { Balance } from '@/src/entities/balance';
import { AccountOverview } from '@/src/widgets/account-overview';
import { AddTransactionModal } from '@/src/widgets/add-transaction-modal';

export const HomePage: React.FC = () => {
	const { incomes, expenses, loading } = useTransactionsByCategory();

	const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
		useState(false);

	const openAddTransactionModal = () => setIsAddTransactionModalOpen(true);
	const closeAddTransactionModal = () => setIsAddTransactionModalOpen(false);

	return (
		<>
			<div className='flex flex-col gap-5 sm:gap-[30px]'>
				<div className='flex flex-col items-start gap-2.5 sm:flex-row sm:justify-between sm:items-center'>
					<Balance />
					<Button
						className='w-full sm:w-auto'
						onClick={openAddTransactionModal}
					>
						Добавить транзакцию
					</Button>
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

			<AddTransactionModal
				isOpen={isAddTransactionModalOpen}
				onClose={closeAddTransactionModal}
			/>
		</>
	);
};
