'use client';

import React, { useEffect, useState } from 'react';

import { api } from '@/src/shared/lib';
import { Button } from '@/src/shared/ui';
import { SettingsBlockItem } from '../settings-block-layout';
import { PinCodeModal } from './pin-code-modal';

type Mode = 'create' | 'change' | 'disable';

export const PinCode: React.FC = () => {
	const [enabled, setEnabled] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [mode, setMode] = useState<Mode | null>(null);

	const load = () => {
		api
			.get<{ enabled: boolean }>('/api/auth/pin')
			.then(response => {
				setEnabled(response.data.enabled);
				setLoaded(true);
			})
			.catch(() => setLoaded(false));
	};

	useEffect(() => {
		load();
	}, []);

	return (
		<>
			<SettingsBlockItem>
				<div className='flex flex-col gap-1.5'>
					<span className='text-[15px] text-[var(--foreground-primary)]'>
						Пин-код
					</span>
					<span>
						Код из 4 цифр для этого устройства. Спрашивается при новом открытии
						приложения.
					</span>
				</div>

				<div className='flex flex-col sm:flex-row gap-2 w-full sm:w-fit'>
					{!loaded ? null : enabled ? (
						<>
							<Button className='w-full sm:w-fit' onClick={() => setMode('change')}>
								Изменить
							</Button>
							<Button className='w-full sm:w-fit' onClick={() => setMode('disable')}>
								Отключить
							</Button>
						</>
					) : (
						<Button className='w-full sm:w-fit' onClick={() => setMode('create')}>
							Установить
						</Button>
					)}
				</div>
			</SettingsBlockItem>

			<PinCodeModal
				mode={mode}
				onClose={() => setMode(null)}
				onChanged={load}
			/>
		</>
	);
};
