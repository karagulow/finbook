'use client';

import { useQuery } from '@tanstack/react-query';

interface BalanceResponse {
	total: number;
	currencyCode: string;
	currencySymbol: string | null;
}

export const useBalance = () => {
	const { data, isLoading, isFetching } = useQuery<BalanceResponse>({
		queryKey: ['balance'],
		queryFn: async () => {
			const res = await fetch('/api/balance', {
				method: 'GET',
				credentials: 'include',
			});
			if (!res.ok) throw new Error('Ошибка при получении баланса');
			return res.json();
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
