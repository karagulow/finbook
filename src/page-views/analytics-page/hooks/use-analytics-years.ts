'use client';

import { useQuery } from '@tanstack/react-query';
import { getAnalyticsYears } from '../lib/get-transactions-by-year';
import { useSelectedAccount } from '@/src/widgets/account-overview/hooks/use-selected-account';

export const useAnalyticsYears = () => {
	const { selectedAccountId } = useSelectedAccount();
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const currentYear = new Date().getFullYear();

	const { data } = useQuery({
		queryKey: ['analytics-years', selectedAccountId, timeZone],
		queryFn: () =>
			getAnalyticsYears({
				accountId: selectedAccountId,
				timeZone,
			}),
		refetchOnWindowFocus: false,
	});

	return data?.length ? data : [currentYear];
};
