'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { api, toastOptions } from '@/src/shared/lib';
import { Button } from '@/src/shared/ui';
import { getPinErrorMessage } from '../lib/pin-error';
import { PinPad } from './pin-pad';

interface PinCreateStepsProps {
	description?: string;
	onComplete: () => void;
	onSkip?: () => void;
}

export const PinCreateSteps: React.FC<PinCreateStepsProps> = ({
	description,
	onComplete,
	onSkip,
}) => {
	const [step, setStep] = useState<'enter' | 'confirm'>('enter');
	const [firstPin, setFirstPin] = useState('');
	const [pin, setPin] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const reset = () => {
		setStep('enter');
		setFirstPin('');
		setPin('');
	};

	const submit = async (value: string) => {
		if (loading) {
			return;
		}

		if (step === 'enter') {
			setFirstPin(value);
			setPin('');
			setError('');
			setStep('confirm');
			return;
		}

		if (value !== firstPin) {
			setError('Пин-коды не совпадают. Попробуйте ещё раз.');
			reset();
			return;
		}

		setLoading(true);

		try {
			await api.post('/api/auth/pin', { pin: value });
			toast.success('Пин-код установлен', toastOptions);
			onComplete();
		} catch (error: unknown) {
			const message = getPinErrorMessage(error);
			if (message) {
				setError(message);
			}
			reset();
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col items-center gap-5 w-full'>
			<div className='flex flex-col items-center gap-1.5 text-center'>
				<h2 className='text-[18px] font-semibold text-[var(--foreground-primary)]'>
					{step === 'enter' ? 'Придумайте пин-код' : 'Повторите пин-код'}
				</h2>
				{description && step === 'enter' && (
					<p className='text-[13px] text-[var(--foreground-secondary)]'>
						{description}
					</p>
				)}
			</div>

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

			<div className='flex flex-col gap-2 w-full'>
				{step === 'confirm' && (
					<Button
						className='w-full h-10'
						disabled={loading}
						onClick={() => {
							setError('');
							reset();
						}}
					>
						Начать заново
					</Button>
				)}
				{onSkip && (
					<Button className='w-full h-10' disabled={loading} onClick={onSkip}>
						Пропустить
					</Button>
				)}
			</div>
		</div>
	);
};
