import React from 'react';

import {
	SettingsBlockItem,
	SettingsBlockLayout,
} from './settings-block-layout';
import { Button, Divider } from '@/src/shared/ui';

import { LogOut, Trash } from 'lucide-react';

export const UserSettings: React.FC = () => {
	return (
		<SettingsBlockLayout title='Аккаунт'>
			<SettingsBlockItem>
				<div className='flex flex-col gap-1.5'>
					<span className='text-[15px] text-[var(--foreground-primary)]'>
						Основная валюта
					</span>
					<span>Выбор основной валюты аккаунта.</span>
				</div>
				<Button className='w-full sm:w-fit'>Настроить</Button>
			</SettingsBlockItem>

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

			<Divider />

			<SettingsBlockItem>
				<div className='flex flex-col gap-1.5'>
					<span className='text-[15px] text-[var(--foreground-primary)]'>
						Электронная почта
					</span>
					<span>Вы вошли как example@mail.com.</span>
				</div>

				<div className='flex flex-row items-center gap-2.5 w-full sm:w-fit'>
					<Button className='w-full sm:w-fit' variant='wrong'>
						<LogOut size={16} strokeWidth={1} />
						Выйти
					</Button>
					<Button className='w-full sm:w-fit'>Поменять почту</Button>
				</div>
			</SettingsBlockItem>

			<Divider />

			<SettingsBlockItem>
				<div className='flex flex-col gap-1.5'>
					<span className='text-[15px] text-[var(--foreground-primary)]'>
						Пароль
					</span>
					<span>Изменить свой пароль для входа в аккаунт.</span>
				</div>

				<Button className='w-full sm:w-fit'>Поменять пароль</Button>
			</SettingsBlockItem>

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
		</SettingsBlockLayout>
	);
};
