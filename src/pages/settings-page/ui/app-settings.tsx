import React from 'react';

import {
	SettingsBlockItem,
	SettingsBlockLayout,
} from './settings-block-layout';
import ThemeSwitcher from './theme-switcher';

export const AppSettings: React.FC = () => {
	return (
		<SettingsBlockLayout title='Приложение'>
			<SettingsBlockItem>
				<span>Оформление</span>
				<ThemeSwitcher />
			</SettingsBlockItem>
		</SettingsBlockLayout>
	);
};
