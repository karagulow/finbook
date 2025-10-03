import React from 'react';

import { StickyHeader } from '@/src/shared/ui';
import { AppSettings } from './app-settings';
import { UserSettings } from './user-settings';

export const SettingsPage: React.FC = () => {
	return (
		<>
			<StickyHeader title='Настройки' />

			<div className='flex flex-col gap-5 sm:gap-[30px]'>
				<h1 className='font-medium text-[24px] text-[var(--foreground-primary)]'>
					Настройки
				</h1>

				<div className='flex flex-row gap-[30px]'>
					<div className='flex flex-col gap-5 w-full'>
						<AppSettings />
						<UserSettings />
					</div>
				</div>
			</div>
		</>
	);
};
