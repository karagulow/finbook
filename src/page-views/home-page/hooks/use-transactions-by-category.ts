'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getTransactionsByMonth } from '../lib/get-transactions-by-month';
import { useSelectedAccount } from '@/src/widgets/account-overview/hooks/use-selected-account';

export type CategoryStat = {
	id: string;
	name: string;
	amount: number;
	color: string;
};

export const useTransactionsByCategory = () => {
	const { selectedAccountId } = useSelectedAccount();

	const { data, isLoading } = useQuery<{
		incomes: CategoryStat[];
		expenses: CategoryStat[];
	}>({
		queryKey: ['transactions', selectedAccountId],
		queryFn: async () => {
			const transactions = await getTransactionsByMonth(selectedAccountId);

			const incomeMap = new Map<string, CategoryStat>();
			const expenseMap = new Map<string, CategoryStat>();

			for (const tx of transactions) {
				if (!tx.category) continue;

				const targetMap =
					tx.type === 'INCOME'
						? incomeMap
						: tx.type === 'EXPENSE'
						? expenseMap
						: null;
				if (!targetMap) continue;

				const prev = targetMap.get(tx.category.id) ?? {
					id: tx.category.id,
					name: tx.category.name,
					amount: 0,
					color: tx.category.color,
				};

				targetMap.set(tx.category.id, {
					...prev,
					amount: prev.amount + (tx.amountInUserCurrency ?? 0),
				});
			}

			return {
				incomes: Array.from(incomeMap.values()),
				expenses: Array.from(expenseMap.values()),
			};
		},
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
	});

	return {
		incomes: data?.incomes ?? [],
		expenses: data?.expenses ?? [],
		isLoading,
	};
};
