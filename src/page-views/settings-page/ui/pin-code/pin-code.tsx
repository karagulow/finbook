'use client';

import React, { useState } from 'react';

import { Button, Divider } from '@/src/shared/ui';
import { SettingsBlockItem } from '../settings-block-layout';
import { BiometricModal } from './biometric-modal';
import { PinCodeModal } from './pin-code-modal';

type Mode = 'create' | 'change' | 'disable';
type BiometricMode = 'enable' | 'disable';

interface PinCodeProps {
	enabled: boolean;
	biometric: boolean;
	platformBiometric: boolean;
	ready: boolean;
	onChanged: () => void;
}

export const PinCode: React.FC<PinCodeProps> = ({
	enabled,
	biometric,
	platformBiometric,
	ready,
	onChanged,
}) => {
	const [mode, setMode] = useState<Mode | null>(null);
	const [biometricMode, setBiometricMode] = useState<BiometricMode | null>(null);

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
					{!ready ? null : enabled ? (
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

			{ready && enabled && (platformBiometric || biometric) && (
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
				onChanged={onChanged}
			/>
			<BiometricModal
				mode={biometricMode}
				onClose={() => setBiometricMode(null)}
				onChanged={onChanged}
			/>
		</>
	);
};
