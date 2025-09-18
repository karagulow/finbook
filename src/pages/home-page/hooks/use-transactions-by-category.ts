'use client';

import { useEffect, useState } from 'react';
import { getTransactionsByMonth } from '../lib/get-transactions-by-month';
import { useSelectedAccount } from '@/src/widgets/account-overview/hooks/use-selected-account';

type CategoryStat = {
	id: string;
	name: string;
	amount: number;
	color: string;
};

export const useTransactionsByCategory = () => {
	const [incomes, setIncomes] = useState<CategoryStat[]>([]);
	const [expenses, setExpenses] = useState<CategoryStat[]>([]);
	const [loading, setLoading] = useState(true);

	const { selectedAccountId } = useSelectedAccount();

	useEffect(() => {
		(async () => {
			try {
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

				setIncomes(Array.from(incomeMap.values()));
				setExpenses(Array.from(expenseMap.values()));
			} finally {
				setLoading(false);
			}
		})();
	}, [selectedAccountId]);

	return { incomes, expenses, loading };
};
