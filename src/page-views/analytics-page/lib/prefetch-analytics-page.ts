'use client';

import { QueryClient } from '@tanstack/react-query';

import { useSelectedAccount } from '@/src/widgets/account-overview/hooks/use-selected-account';
import { balanceQueryOptions } from '@/src/entities/balance/hooks/use-balance';

import { analyticsYearsQueryOptions } from '../hooks/use-analytics-years';
import { yearlyTransactionsQueryOptions } from '../hooks/use-transactions';

export const prefetchAnalyticsPage = (queryClient: QueryClient) => {
	const selectedAccountId = useSelectedAccount.getState().selectedAccountId;
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const currentYear = new Date().getFullYear();

	void Promise.all([
		queryClient.prefetchQuery(balanceQueryOptions()),
		queryClient.prefetchQuery(
			analyticsYearsQueryOptions(selectedAccountId, timeZone),
		),
		queryClient.prefetchQuery(
			yearlyTransactionsQueryOptions(selectedAccountId, timeZone, currentYear),
		),
		queryClient.prefetchQuery(
			yearlyTransactionsQueryOptions(
				selectedAccountId,
				timeZone,
				currentYear - 1,
			),
		),
	]);
};
