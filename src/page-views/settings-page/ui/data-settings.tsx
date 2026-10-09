import React from 'react';

import { SettingsBlockLayout } from './settings-block-layout';
import { ChangeCurrency } from './change-currency/change-currency';
import { Divider } from '@/src/shared/ui';
import { User } from '../model/types';
import { ManageCategories } from './manage-categories/manage-categories';
import { ExportData } from './export-data/export-data';

interface DataSettingsProps {
	user: User;
}

export const DataSettings: React.FC<DataSettingsProps> = ({ user }) => {
	return (
		<SettingsBlockLayout title='Данные'>
			<ChangeCurrency currency={user.currency} />

			<Divider />

			<ManageCategories />

			<Divider />

			<ExportData />
		</SettingsBlockLayout>
	);
};
