'use client';

import { useQuery, type QueryFunction } from '@tanstack/react-query';
import { getTransactionsByYear } from '../lib/get-transactions-by-year';
import { useSelectedAccount } from '@/src/widgets/account-overview/hooks/use-selected-account';
import type { AnalyticsTransaction } from '../model/types';

export const useYearlyTransactions = () => {
	const { selectedAccountId } = useSelectedAccount();

	const queryFn: QueryFunction<AnalyticsTransaction[]> = async () => {
		const txs = await getTransactionsByYear(selectedAccountId);
		return txs as AnalyticsTransaction[];
	};

	const { data, isLoading, isFetching } = useQuery<AnalyticsTransaction[]>({
		queryKey: ['transactions', selectedAccountId],
		queryFn,
		refetchOnWindowFocus: false,
	});

	return {
		transactions: Array.isArray(data) ? data : [],
		loading: isLoading || isFetching,
	};
};
