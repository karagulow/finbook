'use client';

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
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

export function useTransactions(limit = 25) {
	return useInfiniteQuery<
		PaginatedDayGroups,
		Error,
		InfiniteData<PaginatedDayGroups>,
		readonly string[],
		string | null
	>({
		queryKey: ['transactions'],
		queryFn: async ({ pageParam = null }) => {
			const params = new URLSearchParams();
			params.set('limit', String(limit));
			if (pageParam) params.set('cursor', String(pageParam));

			const res = await api.get(`/api/transactions?${params.toString()}`);
			const data: ApiResponse = res.data;

			return {
				groups: groupTransactionsByDay(data.items),
				nextCursor: data.nextCursor,
			};
		},
		refetchOnWindowFocus: false,
		getNextPageParam: lastPage => lastPage.nextCursor ?? null,
		initialPageParam: null,
	});
}
