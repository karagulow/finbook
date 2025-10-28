'use client';

import { useQuery } from '@tanstack/react-query';
import { getTransactionsByYear } from '../lib/get-transactions-by-year';
import { useSelectedAccount } from '@/src/widgets/account-overview/hooks/use-selected-account';

export const useYearlyTransactions = () => {
	const { selectedAccountId } = useSelectedAccount();

	const { data, isLoading, isFetching } = useQuery({
		queryKey: ['transactions', selectedAccountId],
		queryFn: () => getTransactionsByYear(selectedAccountId),
		refetchOnWindowFocus: false,
	});

	return {
		transactions: data ?? [],
		loading: isLoading || isFetching,
	};
};
