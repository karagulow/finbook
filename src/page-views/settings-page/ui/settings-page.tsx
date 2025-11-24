'use client';

import React from 'react';

import { StickyHeader } from '@/src/shared/ui';
import { AppSettings } from './app-settings';
import { UserSettings } from './user-settings';
import { useUser } from '../model/use-user';
import { SettingsBlockSkeleton } from './settings-block-skeleton';
import { DataSettings } from './data-settings';
import { DeviceSettings } from './device-settings';
import { useSessions } from '../model/use-sessions';

export const SettingsPage: React.FC = () => {
	const { user, isLoading: isLoadingUser, error: errorUser } = useUser();
	const {
		sessions,
		loading: isLoadingSessions,
		error: errorSessions,
	} = useSessions();

	const isLoading = isLoadingUser || isLoadingSessions;
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
									<AppSettings />
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
