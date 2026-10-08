'use client';

import React, { useEffect, useState } from 'react';

import { canUsePlatformBiometric } from '@/src/features/pin-code/lib/biometric';
import { api } from '@/src/shared/lib';
import { Button, Divider } from '@/src/shared/ui';
import { SettingsBlockItem } from '../settings-block-layout';
import { BiometricModal } from './biometric-modal';
import { PinCodeModal } from './pin-code-modal';

type Mode = 'create' | 'change' | 'disable';
type BiometricMode = 'enable' | 'disable';

export const PinCode: React.FC = () => {
	const [enabled, setEnabled] = useState(false);
	const [biometric, setBiometric] = useState(false);
	const [platformBiometric, setPlatformBiometric] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [mode, setMode] = useState<Mode | null>(null);
	const [biometricMode, setBiometricMode] = useState<BiometricMode | null>(null);

	const load = () => {
		api
			.get<{ enabled: boolean; biometric: boolean }>('/api/auth/pin')
			.then(response => {
				setEnabled(response.data.enabled);
				setBiometric(response.data.biometric);
				setLoaded(true);
			})
			.catch(() => setLoaded(false));
	};

	useEffect(() => {
		canUsePlatformBiometric().then(setPlatformBiometric);
	}, []);

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

			{loaded && enabled && (platformBiometric || biometric) && (
				<>
					<Divider />
					<SettingsBlockItem>
						<div className='flex flex-col gap-1.5'>
							<span className='text-[15px] text-[var(--foreground-primary)]'>
								Биометрия
							</span>
							<span>
								Лицо или отпечаток этого устройства. Телефон сам покажет Face ID,
								Touch ID или сканер.
							</span>
						</div>

						<Button
							className='w-full sm:w-fit'
							onClick={() => setBiometricMode(biometric ? 'disable' : 'enable')}
						>
							{biometric ? 'Отключить' : 'Включить'}
						</Button>
					</SettingsBlockItem>
				</>
			)}

			<PinCodeModal
				mode={mode}
				onClose={() => setMode(null)}
				onChanged={load}
			/>
			<BiometricModal
				mode={biometricMode}
				onClose={() => setBiometricMode(null)}
				onChanged={load}
			/>
		</>
	);
};
