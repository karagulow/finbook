import { queryOptions } from '@tanstack/react-query';
import { api } from '@/src/shared/lib';

export interface Currency {
	id: string;
	name: string;
	code: string;
	symbol?: string;
}

export const currenciesQueryOptions = () =>
	queryOptions({
		queryKey: ['currencies'],
		queryFn: async () => {
			const { data } = await api.get<Currency[]>('/api/currencies');
			return data;
		},
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});
