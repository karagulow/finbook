'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/shared/lib';
import { DebtsResponse } from '../model/types';

export const useDebts = () => {
	const { data, isLoading, isError } = useQuery<DebtsResponse>({
		queryKey: ['debts'],
		queryFn: async () => {
			const res = await api.get('/api/debts');
			return res.data;
		},
		refetchOnWindowFocus: false,
	});

	return {
		debts: data?.debts ?? [],
		currencyCode: data?.currencyCode ?? '',
		currencySymbol: data?.currencySymbol ?? null,
		isLoading,
		isError,
	};
};
