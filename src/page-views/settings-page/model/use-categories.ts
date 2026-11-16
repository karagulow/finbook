'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/src/shared/lib';

export interface Category {
	id: string;
	name: string;
	icon: string;
	color: string;
	type: 'INCOME' | 'EXPENSE';
	subcategories: { id: string; name: string }[];
}

export const categoriesQueryOptions = () =>
	queryOptions({
		queryKey: ['categories'],
		queryFn: async () => {
			const res = await api.get('/api/categories');
			return res.data as Category[];
		},
		staleTime: 60_000,
	});

export const useCategories = () => {
	const {
		data: categories = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		...categoriesQueryOptions(),
		refetchOnWindowFocus: false,
	});

	return {
		categories,
		loading: isLoading,
		isError,
		error,
	};
};
