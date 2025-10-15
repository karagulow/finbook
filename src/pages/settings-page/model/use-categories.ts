'use client';

import { useQuery } from '@tanstack/react-query';

export interface Category {
	id: string;
	name: string;
	icon: string;
	color: string;
	type: 'INCOME' | 'EXPENSE';
	subcategories: { id: string; name: string }[];
}

export const useCategories = () => {
	const {
		data: categories = [],
		isLoading,
		isError,
		error,
	} = useQuery<Category[]>({
		queryKey: ['categories'],
		queryFn: async () => {
			const res = await fetch('/api/categories', { credentials: 'include' });
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Ошибка при загрузке категорий');
			}

			return data;
		},
		refetchOnWindowFocus: false,
	});

	return {
		categories,
		loading: isLoading,
		isError,
		error,
	};
};
