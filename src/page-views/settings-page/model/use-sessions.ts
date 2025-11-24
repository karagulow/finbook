'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/shared/lib';

export type Session = {
	id: string;
	deviceInfo: string;
	createdAt: string;
	isCurrent: boolean;
};

export function useSessions() {
	const queryClient = useQueryClient();

	const { data, isLoading, isFetching, error, isError } = useQuery({
		queryKey: ['sessions'],
		queryFn: async () => {
			const { data } = await api.get('/api/sessions');
			return data;
		},
		refetchOnWindowFocus: false,
	});

	const deleteSession = useMutation({
		mutationFn: async (id: string) => {
			return api.post(`/api/sessions/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['sessions'] });
		},
	});

	const deleteOtherSessions = useMutation({
		mutationFn: async () => {
			return api.post('/api/sessions');
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['sessions'] });
		},
	});

	return {
		sessions: data ?? [],
		loading: isLoading,
		error: isError ? error : null,

		deleteSession: deleteSession.mutateAsync,
		deleteOtherSessions: deleteOtherSessions.mutateAsync,
	};
}
