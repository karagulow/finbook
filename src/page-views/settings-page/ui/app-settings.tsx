import React from 'react';

import { Divider } from '@/src/shared/ui';
import {
	SettingsBlockItem,
	SettingsBlockLayout,
} from './settings-block-layout';
import { PinCode } from './pin-code/pin-code';
import ThemeSwitcher from './theme-switcher';

export const AppSettings: React.FC = () => {
	return (
		<SettingsBlockLayout title='Приложение'>
			<SettingsBlockItem>
				<div className='flex flex-col gap-1.5'>
					<span className='text-[15px] text-[var(--foreground-primary)]'>
						Оформление
					</span>
					<span>Выбор основной цветовой схемы оформления.</span>
				</div>
				<ThemeSwitcher />
			</SettingsBlockItem>

			<Divider />

			<PinCode />
		</SettingsBlockLayout>
	);
};
