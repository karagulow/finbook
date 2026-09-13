'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/shared/lib';

export type Session = {
	id: string;
	deviceInfo: string;
	location: string | null;
	createdAt: string;
	isCurrent: boolean;
};

export function useSessions() {
	const queryClient = useQueryClient();

	const { data, isLoading, error, isError } = useQuery({
		queryKey: ['sessions'],
		queryFn: async () => {
			const { data } = await api.get('/api/sessions');
			return data;
		},
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
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
		isLoading,
		error: isError ? error : null,

		deleteSession: deleteSession.mutateAsync,
		deleteOtherSessions: deleteOtherSessions.mutateAsync,
	};
}
