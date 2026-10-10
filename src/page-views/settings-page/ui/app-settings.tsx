import React from 'react';

import { Divider } from '@/src/shared/ui';
import {
	SettingsBlockItem,
	SettingsBlockLayout,
} from './settings-block-layout';
import { PinCode } from './pin-code/pin-code';
import ThemeSwitcher from './theme-switcher';

interface AppSettingsProps {
	pinEnabled: boolean;
	biometricEnabled: boolean;
	platformBiometric: boolean;
	pinReady: boolean;
	onPinChanged: () => void;
}

export const AppSettings: React.FC<AppSettingsProps> = ({
	pinEnabled,
	biometricEnabled,
	platformBiometric,
	pinReady,
	onPinChanged,
}) => {
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

			<PinCode
				enabled={pinEnabled}
				biometric={biometricEnabled}
				platformBiometric={platformBiometric}
				ready={pinReady}
				onChanged={onPinChanged}
			/>
		</SettingsBlockLayout>
	);
};
