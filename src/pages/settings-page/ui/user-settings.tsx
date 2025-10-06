import React from 'react';

import {
	SettingsBlockItem,
	SettingsBlockLayout,
} from './settings-block-layout';
import { Button, Divider } from '@/src/shared/ui';

import { Trash } from 'lucide-react';
import { User } from '../model/types';
import { ChangePassword } from './change-password/change-password';
import { LogoutButton } from './logout-button';

interface UserSettingsProps {
	user: User;
}

export const UserSettings: React.FC<UserSettingsProps> = ({ user }) => {
	return (
		<SettingsBlockLayout title='Аккаунт'>
			<SettingsBlockItem>
				<div className='flex flex-col gap-1.5'>
					<span className='text-[15px] text-[var(--foreground-primary)]'>
						Электронная почта
					</span>
					<span>Вы вошли как {user.email}.</span>
				</div>

				<Button className='w-full sm:w-fit'>Поменять почту</Button>
			</SettingsBlockItem>

			<Divider />

			<ChangePassword />

			<Divider />

			<SettingsBlockItem>
				<div className='flex flex-col gap-1.5'>
					<span className='text-[15px] text-[var(--foreground-primary)]'>
						Учётная запись
					</span>
					<span>
						После удаления аккаунта восстановление невозможно.
						<br />
						Пожалуйста, убедитесь в своем решении.
					</span>
				</div>
				<Button className='w-full sm:w-fit' variant='wrong'>
					<Trash size={16} strokeWidth={1} />
					Удалить
				</Button>
			</SettingsBlockItem>

			<Divider />

			<LogoutButton />
		</SettingsBlockLayout>
	);
};
