'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { getTransactionsByMonth } from '../lib/get-transactions-by-month';
import { useSelectedAccount } from '@/src/widgets/account-overview/hooks/use-selected-account';

export type CategoryStat = {
	id: string;
	name: string;
	amount: number;
	color: string;
};

export const transactionsByCategoryQueryOptions = (
	accountId: string | null,
	timeZone: string,
) =>
	queryOptions({
		queryKey: ['transactions', accountId, timeZone],
		queryFn: async () => {
			const transactions = await getTransactionsByMonth({
				accountId,
				timeZone,
			});

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
		staleTime: 60_000,
	});

export const useTransactionsByCategory = () => {
	const { selectedAccountId } = useSelectedAccount();
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const { data, isLoading } = useQuery({
		...transactionsByCategoryQueryOptions(selectedAccountId, timeZone),
		refetchOnWindowFocus: false,
		placeholderData: previousData => previousData,
	});

	return {
		incomes: data?.incomes ?? [],
		expenses: data?.expenses ?? [],
		isLoading,
	};
};
