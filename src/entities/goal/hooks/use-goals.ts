'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/shared/lib';
import { GoalsResponse } from '../model/types';

export const useGoals = () => {
	const { data, isLoading, isError } = useQuery<GoalsResponse>({
		queryKey: ['goals'],
		queryFn: async () => {
			const res = await api.get('/api/goals');
			return res.data;
		},
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
