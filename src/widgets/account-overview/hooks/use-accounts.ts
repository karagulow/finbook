'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { getAccounts } from '../lib/get-accounts';
import { useBalance } from '@/src/entities/balance';

export const accountsQueryOptions = () =>
	queryOptions({
		queryKey: ['accounts'],
		queryFn: getAccounts,
		staleTime: 60_000,
	});

export const useAccounts = () => {
	const { data, isLoading, isFetching } = useQuery({
		...accountsQueryOptions(),
		refetchOnWindowFocus: false,
	});

	const balance = useBalance();

	return {
		accounts: data ?? [],
		totalBalance: balance.total,
		currencyCode: balance.currencyCode,
		currencySymbol: balance.currencySymbol,
		loading: isLoading || isFetching || balance.loading,
	};
};
