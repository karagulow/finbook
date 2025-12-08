'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/shared/lib';

import type { User } from './types';

export function useUser() {
	const { data, isLoading, error, isError } = useQuery<User>({
		queryKey: ['user'],
		queryFn: async () => {
			const { data } = await api.get<User>('/api/user');
			return data;
		},
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});

	return { user: data, isLoading, error, isError };
}
