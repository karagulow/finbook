'use client';

import { QueryClient } from '@tanstack/react-query';

import { goalsQueryOptions } from '@/src/entities/goal/hooks/use-goals';
import { debtsQueryOptions } from '@/src/entities/debt/hooks/use-debts';
import { useSelectedAccount } from '@/src/widgets/account-overview/hooks/use-selected-account';
import { transactionsByCategoryQueryOptions } from '../hooks/use-transactions-by-category';
import { balanceQueryOptions } from '@/src/entities/balance/hooks/use-balance';
import { accountsQueryOptions } from '@/src/widgets/account-overview/hooks/use-accounts';

export const prefetchHomePage = (queryClient: QueryClient) => {
	const selectedAccountId = useSelectedAccount.getState().selectedAccountId;
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	void Promise.all([
		queryClient.prefetchQuery(balanceQueryOptions()),
		queryClient.prefetchQuery(accountsQueryOptions()),
		queryClient.prefetchQuery(goalsQueryOptions()),
		queryClient.prefetchQuery(debtsQueryOptions()),
		queryClient.prefetchQuery(
			transactionsByCategoryQueryOptions(selectedAccountId, timeZone),
		),
	]);
};
