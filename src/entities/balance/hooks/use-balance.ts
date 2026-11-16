'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/src/shared/lib';

interface BalanceResponse {
	total: number;
	currencyCode: string;
	currencySymbol: string | null;
}

export const balanceQueryOptions = () =>
	queryOptions({
		queryKey: ['balance'],
		queryFn: async () => {
			const res = await api.get<BalanceResponse>('/api/balance');
			return res.data;
		},
		staleTime: 60_000,
	});

export const useBalance = () => {
	const { data, isLoading, isFetching } = useQuery({
		...balanceQueryOptions(),
		refetchOnWindowFocus: false,
	});

	return {
		total: data?.total ?? 0,
		currencyCode: data?.currencyCode ?? '',
		currencySymbol: data?.currencySymbol ?? null,
		loading: isLoading || isFetching,
	};
};
