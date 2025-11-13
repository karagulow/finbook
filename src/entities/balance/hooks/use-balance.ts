'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/shared/lib';

interface BalanceResponse {
	total: number;
	currencyCode: string;
	currencySymbol: string | null;
}

export const useBalance = () => {
	const { data, isLoading, isFetching } = useQuery<BalanceResponse>({
		queryKey: ['balance'],
		queryFn: async () => {
			const res = await api.get('/api/balance');
			return res.data;
		},
		refetchOnWindowFocus: false,
	});

	return {
		total: data?.total ?? 0,
		currencyCode: data?.currencyCode ?? '',
		currencySymbol: data?.currencySymbol ?? null,
		loading: isLoading || isFetching,
	};
};
