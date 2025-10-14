'use client';

import { useQuery } from '@tanstack/react-query';
import { getAccounts } from '../lib/get-accounts';

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

			const balanceRes = await fetch('/api/balance', {
				method: 'GET',
				credentials: 'include',
			});
			const balanceData: BalanceResponse = await balanceRes.json();

			return {
				accounts: accountsData,
				totalBalance: balanceData.total,
				currencyCode: balanceData.currencyCode,
				currencySymbol: balanceData.currencySymbol,
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
