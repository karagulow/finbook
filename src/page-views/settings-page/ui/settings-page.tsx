'use client';

import React from 'react';

import { StickyHeader } from '@/src/shared/ui';
import { AppSettings } from './app-settings';
import { UserSettings } from './user-settings';
import { SettingsBlockSkeleton } from './settings-block-skeleton';
import { DataSettings } from './data-settings';
import { DeviceSettings } from './device-settings';
import { useUser } from '@/src/entities/user/model/use-user';
import { useSessions } from '@/src/entities/session/model/use-sessions';
import { usePinSettings } from '@/src/entities/user/model/use-pin-settings';

export const SettingsPage: React.FC = () => {
	const { user, isLoading: isLoadingUser, error: errorUser } = useUser();
	const {
		sessions,
		isLoading: isLoadingSessions,
		error: errorSessions,
	} = useSessions();
	const pin = usePinSettings();

	const isLoading = isLoadingUser || isLoadingSessions || pin.isLoading;
	const error = errorUser || errorSessions;

	return (
		<>
			<StickyHeader title='Настройки' />

			<div className='flex flex-col gap-5 sm:gap-[30px]'>
				<h1 className='font-medium text-[24px] text-[var(--foreground-primary)]'>
					Настройки
				</h1>

				{isLoading
					? [...Array(3)].map((_, index) => (
							<SettingsBlockSkeleton key={index} />
						))
					: !error &&
						user && (
							<div className='flex flex-row gap-[30px]'>
								<div className='flex flex-col gap-5 w-full'>
									<AppSettings
										pinEnabled={pin.enabled}
										biometricEnabled={pin.biometric}
										platformBiometric={pin.platformBiometric}
										pinReady={pin.isReady}
										onPinChanged={pin.reload}
									/>
									<DataSettings user={user} />
									<DeviceSettings sessions={sessions} />
									<UserSettings user={user} />
								</div>
							</div>
						)}
			</div>
		</>
	);
};
