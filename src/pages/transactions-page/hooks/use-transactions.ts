'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { DayGroup, Transaction } from '../model/types';

interface ApiResponse {
	items: Transaction[];
	nextCursor: string | null;
}

function groupTransactionsByDay(transactions: Transaction[]): DayGroup[] {
	const groups: Record<string, DayGroup> = {};

	for (const tx of transactions) {
		const day = new Date(tx.date).toISOString().split('T')[0];

		if (!groups[day]) {
			groups[day] = { date: day, income: 0, expense: 0, transactions: [] };
		}

		if (tx.type === 'INCOME') {
			groups[day].income += tx.amount;
		} else if (tx.type === 'EXPENSE') {
			groups[day].expense += tx.amount;
		}

		groups[day].transactions.push(tx);
	}

	return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
}

export function useTransactions(limit = 25) {
	return useInfiniteQuery<DayGroup[], Error>({
		queryKey: ['transactions'],
		queryFn: async ({ pageParam = null }) => {
			const params = new URLSearchParams();
			params.set('limit', String(limit));
			if (pageParam) params.set('cursor', String(pageParam));

			const res = await fetch(`/api/transactions?${params.toString()}`);
			if (!res.ok) throw new Error('Ошибка загрузки транзакций');

			const data: ApiResponse = await res.json();
			return groupTransactionsByDay(data.items);
		},
		getNextPageParam: () => null,
		initialPageParam: null,
	});
}
