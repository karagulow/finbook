import React from 'react';

import {
	SettingsBlockItem,
	SettingsBlockLayout,
} from './settings-block-layout';
import { ChangeCurrency } from './change-currency/change-currency';
import { Button, Divider } from '@/src/shared/ui';
import { User } from '../model/types';

interface DataSettingsProps {
	user: User;
}

export const DataSettings: React.FC<DataSettingsProps> = ({ user }) => {
	return (
		<SettingsBlockLayout title='Данные'>
			<ChangeCurrency currency={user.currency} />

			<Divider />

			<SettingsBlockItem>
				<div className='flex flex-col gap-1.5'>
					<span className='text-[15px] text-[var(--foreground-primary)]'>
						Категории
					</span>
					<span>Выбор категорий и подкатегорий транзакций.</span>
				</div>
				<Button className='w-full sm:w-fit'>Настроить</Button>
			</SettingsBlockItem>
		</SettingsBlockLayout>
	);
};
