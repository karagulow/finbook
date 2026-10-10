'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { canUsePlatformBiometric } from '@/src/features/pin-code/lib/biometric';
import { api } from '@/src/shared/lib';

type PinStatus = {
	enabled: boolean;
	biometric: boolean;
};

export function usePinSettings() {
	const queryClient = useQueryClient();

	const pin = useQuery({
		queryKey: ['pin-settings'],
		queryFn: async () => {
			const { data } = await api.get<PinStatus>('/api/auth/pin');
			return data;
		},
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});

	const platformBiometric = useQuery({
		queryKey: ['platform-biometric'],
		queryFn: canUsePlatformBiometric,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
		gcTime: 30 * 60 * 1000,
	});

	const reload = () => {
		void queryClient.invalidateQueries({ queryKey: ['pin-settings'] });
	};

	return {
		enabled: pin.data?.enabled ?? false,
		biometric: pin.data?.biometric ?? false,
		platformBiometric: platformBiometric.data ?? false,
		isLoading: pin.isLoading || platformBiometric.isLoading,
		isReady: pin.isSuccess && platformBiometric.isSuccess,
		reload,
	};
}
