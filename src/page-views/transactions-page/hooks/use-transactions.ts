'use client';

import { useInfiniteQuery, infiniteQueryOptions } from '@tanstack/react-query';
import { DayGroup, Transaction } from '../model/types';
import { api } from '@/src/shared/lib';

interface ApiResponse {
	items: Transaction[];
	nextCursor: string | null;
}

interface PaginatedDayGroups {
	groups: DayGroup[];
	nextCursor: string | null;
}

function groupTransactionsByDay(transactions: Transaction[]): DayGroup[] {
	const groups: Record<string, DayGroup> = {};

	for (const tx of transactions) {
		const day = new Date(tx.date).toLocaleDateString('sv-SE');

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

export function transactionsQueryOptions(limit = 50) {
	return infiniteQueryOptions({
		queryKey: ['transactions'] as const,
		queryFn: async ({ pageParam }) => {
			const params = new URLSearchParams();
			params.set('limit', String(limit));

			if (pageParam) {
				params.set('cursor', String(pageParam));
			}

			const res = await api.get(`/api/transactions?${params.toString()}`);
			const data: ApiResponse = res.data;

			return {
				groups: groupTransactionsByDay(data.items),
				nextCursor: data.nextCursor,
			};
		},
		getNextPageParam: (lastPage: PaginatedDayGroups) => lastPage.nextCursor,
		initialPageParam: null as string | null,
		staleTime: 60_000,
	});
}

export function useTransactions(limit = 50) {
	return useInfiniteQuery({
		...transactionsQueryOptions(limit),
		refetchOnWindowFocus: false,
	});
}
