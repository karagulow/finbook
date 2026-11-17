'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { getAnalyticsYears } from '../lib/get-transactions-by-year';
import { useSelectedAccount } from '@/src/widgets/account-overview/hooks/use-selected-account';

export const analyticsYearsQueryOptions = (
	accountId: string | null,
	timeZone: string,
) =>
	queryOptions({
		queryKey: ['analytics-years', accountId, timeZone],
		queryFn: () =>
			getAnalyticsYears({
				accountId,
				timeZone,
			}),
		staleTime: 60_000,
	});

export const useAnalyticsYears = () => {
	const { selectedAccountId } = useSelectedAccount();
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const currentYear = new Date().getFullYear();

	const { data } = useQuery({
		...analyticsYearsQueryOptions(selectedAccountId, timeZone),
		refetchOnWindowFocus: false,
	});

	return data?.length ? data : [currentYear];
};
