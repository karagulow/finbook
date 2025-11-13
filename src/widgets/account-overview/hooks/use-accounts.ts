'use client';

import { useQuery } from '@tanstack/react-query';
import { getAccounts } from '../lib/get-accounts';
import { api } from '@/src/shared/lib';

export type Account = {
	id: string;
	name: string;
	balance: number;
	currency: string;
	currencyId: string;
};

interface BalanceResponse {
	total: number;
	currencyCode: string;
	currencySymbol: string | null;
}

export const useAccounts = () => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ['accounts'],
		queryFn: async () => {
			const accountsData = await getAccounts();
			const balanceData = await api.get<BalanceResponse>('/api/balance');

			return {
				accounts: accountsData,
				totalBalance: balanceData.data.total,
				currencyCode: balanceData.data.currencyCode,
				currencySymbol: balanceData.data.currencySymbol,
			};
		},
		refetchOnWindowFocus: false,
	});

	return {
		accounts: data?.accounts ?? [],
		totalBalance: data?.totalBalance ?? 0,
		currencyCode: data?.currencyCode ?? '',
		currencySymbol: data?.currencySymbol ?? null,
		loading: isLoading || isFetching,
	};
};
