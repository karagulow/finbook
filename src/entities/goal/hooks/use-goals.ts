'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/src/shared/lib';
import { GoalsResponse } from '../model/types';

export const goalsQueryOptions = () =>
	queryOptions({
		queryKey: ['goals'],
		queryFn: async () => {
			const res = await api.get('/api/goals');
			return res.data as GoalsResponse;
		},
		staleTime: 60_000,
	});

export const useGoals = () => {
	const { data, isLoading, isError } = useQuery({
		...goalsQueryOptions(),
		refetchOnWindowFocus: false,
	});

	return {
		goals: data?.goals ?? [],
		currencyCode: data?.currencyCode ?? '',
		currencySymbol: data?.currencySymbol ?? null,
		isLoading,
		isError,
	};
};
