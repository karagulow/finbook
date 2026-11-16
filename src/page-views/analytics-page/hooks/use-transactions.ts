'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { getTransactionsByYear } from '../lib/get-transactions-by-year';
import { useSelectedAccount } from '@/src/widgets/account-overview/hooks/use-selected-account';
import type { AnalyticsTransaction } from '../model/types';

export const yearlyTransactionsQueryOptions = (
	accountId: string | null,
	timeZone: string,
	year: number,
) =>
	queryOptions({
		queryKey: ['transactions', accountId, timeZone, year],
		queryFn: async () => {
			const txs = await getTransactionsByYear({
				accountId,
				timeZone,
				year,
			});

			return txs as AnalyticsTransaction[];
		},
		staleTime: 60_000,
	});

export const useYearlyTransactions = (year: number) => {
	const { selectedAccountId } = useSelectedAccount();
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const { data, isLoading, isFetching } = useQuery({
		...yearlyTransactionsQueryOptions(selectedAccountId, timeZone, year),
		refetchOnWindowFocus: false,
	});

	return {
		transactions: Array.isArray(data) ? data : [],
		loading: isLoading || isFetching,
	};
};
