'use client';

import { useQuery, type QueryFunction } from '@tanstack/react-query';
import { getTransactionsByYear } from '../lib/get-transactions-by-year';
import { useSelectedAccount } from '@/src/widgets/account-overview/hooks/use-selected-account';
import type { AnalyticsTransaction } from '../model/types';

export const useYearlyTransactions = () => {
	const { selectedAccountId } = useSelectedAccount();

	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const queryFn: QueryFunction<AnalyticsTransaction[]> = async () => {
		const txs = await getTransactionsByYear({
			accountId: selectedAccountId,
			timeZone,
		});
		return txs as AnalyticsTransaction[];
	};

	const { data, isLoading, isFetching } = useQuery<AnalyticsTransaction[]>({
		queryKey: ['transactions', selectedAccountId, timeZone],
		queryFn,
		refetchOnWindowFocus: false,
	});

	return {
		transactions: Array.isArray(data) ? data : [],
		loading: isLoading || isFetching,
	};
};
