import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/src/shared/lib';
import { User } from './types';

export const userQueryOptions = () =>
	queryOptions({
		queryKey: ['user'],
		queryFn: async () => {
			const { data } = await api.get<User>('/api/user');
			return data;
		},
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});

export function useUser() {
	const { data, isLoading, error, isError } = useQuery({
		...userQueryOptions(),
		refetchOnWindowFocus: false,
	});

	return { user: data, isLoading, error, isError };
}
