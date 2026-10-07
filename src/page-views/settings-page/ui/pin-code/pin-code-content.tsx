'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { PinCreateSteps } from '@/src/features/pin-code/ui/pin-create-steps';
import { PinPad } from '@/src/features/pin-code/ui/pin-pad';
import { getPinErrorMessage } from '@/src/features/pin-code/lib/pin-error';
import { api, toastOptions } from '@/src/shared/lib';
import { Button } from '@/src/shared/ui';

type Mode = 'create' | 'change' | 'disable';
type ChangeStep = 'current' | 'next' | 'confirm';

interface PinCodeContentProps {
	mode: Mode;
	onClose: () => void;
	onChanged: () => void;
}

export const PinCodeContent: React.FC<PinCodeContentProps> = ({
	mode,
	onClose,
	onChanged,
}) => {
	if (mode === 'create') {
		return (
			<PinCreateSteps
				description='Он понадобится при следующем открытии Финкнижки на этом устройстве.'
				onComplete={() => {
					onChanged();
					onClose();
				}}
			/>
		);
	}

	return (
		<PinVerifyFlow mode={mode} onClose={onClose} onChanged={onChanged} />
	);
};

const PinVerifyFlow: React.FC<{
	mode: 'change' | 'disable';
	onClose: () => void;
	onChanged: () => void;
}> = ({ mode, onClose, onChanged }) => {
	const [step, setStep] = useState<ChangeStep>('current');
	const [currentPin, setCurrentPin] = useState('');
	const [nextPin, setNextPin] = useState('');
	const [pin, setPin] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const title =
		mode === 'disable'
			? 'Введите текущий пин-код'
			: step === 'current'
				? 'Введите текущий пин-код'
				: step === 'next'
					? 'Придумайте новый пин-код'
					: 'Повторите новый пин-код';

	const finishChange = async (value: string, current: string) => {
		setLoading(true);

		try {
			await api.patch('/api/auth/pin', { currentPin: current, pin: value });
			toast.success('Пин-код изменён', toastOptions);
			onChanged();
			onClose();
		} catch (error: unknown) {
			const message = getPinErrorMessage(error);
			if (message) {
				setError(message);
			}
			setStep('current');
			setCurrentPin('');
			setNextPin('');
			setPin('');
			setLoading(false);
		}
	};

	const finishDisable = async (value: string) => {
		setLoading(true);

		try {
			await api.delete('/api/auth/pin', { data: { currentPin: value } });
			toast.success('Пин-код отключён', toastOptions);
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

		if (mode === 'disable') {
			await finishDisable(value);
			return;
		}

		if (step === 'current') {
			setLoading(true);

			try {
				await api.post('/api/auth/pin/verify', { pin: value });
				setCurrentPin(value);
				setPin('');
				setError('');
				setStep('next');
			} catch (error: unknown) {
				const message = getPinErrorMessage(error);
				if (message) {
					setError(message);
				}
				setPin('');
			} finally {
				setLoading(false);
			}

			return;
		}

		if (step === 'next') {
			setNextPin(value);
			setPin('');
			setError('');
			setStep('confirm');
			return;
		}

		if (value !== nextPin) {
			setError('Пин-коды не совпадают. Попробуйте ещё раз.');
			setNextPin('');
			setPin('');
			setStep('next');
			return;
		}

		await finishChange(value, currentPin);
	};

	return (
		<div className='flex flex-col items-center gap-5 w-full'>
			<h2 className='text-[18px] font-semibold text-center text-[var(--foreground-primary)]'>
				{title}
			</h2>

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

			{mode === 'change' && step !== 'current' && (
				<Button
					className='w-full h-10'
					disabled={loading}
					onClick={() => {
						setError('');
						setStep('current');
						setCurrentPin('');
						setNextPin('');
						setPin('');
					}}
				>
					Начать заново
				</Button>
			)}
		</div>
	);
};
