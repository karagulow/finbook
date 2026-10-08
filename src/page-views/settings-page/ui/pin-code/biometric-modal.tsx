'use client';

import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
	startRegistration,
	WebAuthnAbortService,
	type PublicKeyCredentialCreationOptionsJSON,
} from '@simplewebauthn/browser';

import { getPinErrorMessage } from '@/src/features/pin-code/lib/pin-error';
import { isBiometricCancel } from '@/src/features/pin-code/lib/biometric';
import { PinPad } from '@/src/features/pin-code/ui/pin-pad';
import { api, toastOptions } from '@/src/shared/lib';
import { Button, Dialog } from '@/src/shared/ui';

type Mode = 'enable' | 'disable';

interface BiometricModalProps {
	mode: Mode | null;
	onClose: () => void;
	onChanged: () => void;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
	mode,
	onClose,
	onChanged,
}) => {
	const close = () => {
		WebAuthnAbortService.cancelCeremony();
		onClose();
	};

	return (
		<Dialog isOpen={Boolean(mode)} onClose={close} className='max-w-[360px]'>
			{mode && (
				<BiometricFlow
					key={mode}
					mode={mode}
					onClose={close}
					onChanged={onChanged}
				/>
			)}
		</Dialog>
	);
};

const BiometricFlow: React.FC<{
	mode: Mode;
	onClose: () => void;
	onChanged: () => void;
}> = ({ mode, onClose, onChanged }) => {
	const [pin, setPin] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [waitingForDevice, setWaitingForDevice] = useState(false);
	const ignoreCancel = useRef(false);

	const finishEnable = async (value: string) => {
		setLoading(true);
		setError('');

		try {
			const options = await api.post<PublicKeyCredentialCreationOptionsJSON>(
				'/api/auth/biometric/register/options',
				{ pin: value },
			);

			setWaitingForDevice(true);
			const registration = await startRegistration({ optionsJSON: options.data });
			await api.post('/api/auth/biometric/register', registration);
			toast.success('Биометрия включена', toastOptions);
			onChanged();
			onClose();
		} catch (error: unknown) {
			if (ignoreCancel.current) {
				ignoreCancel.current = false;
				return;
			}

			if (isBiometricCancel(error)) {
				setError('Подтверждение отменено. Введите пин-код ещё раз.');
			} else {
				const message = getPinErrorMessage(error);
				if (message) {
					setError(message);
				}
			}

			setPin('');
			setWaitingForDevice(false);
			setLoading(false);
		}
	};

	const finishDisable = async (value: string) => {
		setLoading(true);

		try {
			await api.delete('/api/auth/biometric', { data: { currentPin: value } });
			toast.success('Биометрия отключена', toastOptions);
			onChanged();
			onClose();
		} catch (error: unknown) {
			const message = getPinErrorMessage(error);
			if (message) {
				setError(message);
			}
			setPin('');
			setLoading(false);
		}
	};

	const submit = async (value: string) => {
		if (loading) {
			return;
		}

		if (mode === 'enable') {
			await finishEnable(value);
			return;
		}

		await finishDisable(value);
	};

	return (
		<div className='flex flex-col items-center gap-5 w-full'>
			<div className='flex flex-col items-center gap-1.5 text-center'>
				<h2 className='text-[18px] font-semibold text-[var(--foreground-primary)]'>
					{mode === 'enable' ? 'Включить биометрию' : 'Отключить биометрию'}
				</h2>
				<p className='text-[13px] text-[var(--foreground-secondary)]'>
					{waitingForDevice
						? 'Подтвердите лицо или отпечаток в системном окне.'
						: 'Введите текущий пин-код'}
				</p>
			</div>

			{waitingForDevice ? null : (
				<PinPad
					value={pin}
					onChange={next => {
						setError('');
						setPin(next);
					}}
					onComplete={submit}
					disabled={loading}
					error={error}
				/>
			)}

			{mode === 'enable' && waitingForDevice && (
				<Button
					className='w-full h-10'
					onClick={() => {
						ignoreCancel.current = true;
						WebAuthnAbortService.cancelCeremony();
						setWaitingForDevice(false);
						setPin('');
						setError('');
						setLoading(false);
					}}
				>
					Назад к пин-коду
				</Button>
			)}
		</div>
	);
};
