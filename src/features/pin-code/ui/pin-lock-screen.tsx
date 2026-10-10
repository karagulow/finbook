'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
	startAuthentication,
	WebAuthnAbortService,
	type PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser';

import { api } from '@/src/shared/lib';
import { safeNextPath } from '@/src/shared/lib/pin-constants';
import { useAuthStore } from '@/src/shared/store/authStore';
import { Button } from '@/src/shared/ui';
import { canUsePlatformBiometric, isBiometricCancel } from '../lib/biometric';
import { getPinErrorMessage } from '../lib/pin-error';
import { PinPad } from './pin-pad';

export const PinLockScreen: React.FC = () => {
	const searchParams = useSearchParams();
	const logout = useAuthStore(state => state.logout);
	const [ready, setReady] = useState(false);
	const [biometric, setBiometric] = useState(false);
	const [pin, setPin] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const biometricAttempt = useRef(0);
	const biometricActive = useRef(false);

	const unlockWithBiometric = useCallback(async () => {
		if (biometricActive.current) {
			return;
		}

		const attempt = ++biometricAttempt.current;
		biometricActive.current = true;
		setError('');

		try {
			const options = await api.post<PublicKeyCredentialRequestOptionsJSON>(
				'/api/auth/biometric/authenticate/options',
			);
			const authentication = await startAuthentication({
				optionsJSON: options.data,
			});

			if (attempt !== biometricAttempt.current) {
				return;
			}

			setLoading(true);
			await api.post('/api/auth/biometric/authenticate', authentication);

			if (attempt !== biometricAttempt.current) {
				return;
			}

			window.location.assign(safeNextPath(searchParams?.get('next') ?? null));
		} catch (error: unknown) {
			if (attempt !== biometricAttempt.current) {
				return;
			}

			biometricActive.current = false;

			if (!isBiometricCancel(error)) {
				const message = getPinErrorMessage(error);
				if (message) {
					setError(message);
				}
			}

			setLoading(false);
		}
	}, [searchParams]);

	useEffect(() => {
		let cancelled = false;

		api
			.get<{ enabled: boolean; biometric: boolean }>('/api/auth/pin')
			.then(async response => {
				if (cancelled) {
					return;
				}

				if (!response.data.enabled) {
					window.location.replace('/home');
					return;
				}

				const available =
					response.data.biometric && (await canUsePlatformBiometric());

				if (cancelled) {
					return;
				}

				setBiometric(available);
				setReady(true);

				if (available) {
					void unlockWithBiometric();
				}
			})
			.catch(() => {
				if (!cancelled) {
					window.location.replace('/login');
				}
			});

		return () => {
			cancelled = true;
			biometricAttempt.current += 1;
			biometricActive.current = false;
			WebAuthnAbortService.cancelCeremony();
		};
	}, [unlockWithBiometric]);

	const unlock = async (value: string) => {
		if (loading || biometricActive.current) {
			return;
		}

		setLoading(true);

		try {
			await api.post('/api/auth/unlock', { pin: value });
			window.location.assign(safeNextPath(searchParams?.get('next') ?? null));
		} catch (error: unknown) {
			const message = getPinErrorMessage(error);

			if (message) {
				setError(message);
			}

			setPin('');
			setLoading(false);
		}
	};

	const loginWithPassword = async () => {
		if (loading || biometricActive.current) {
			return;
		}

		setLoading(true);

		try {
			await api.post('/api/auth/logout');
		} catch {
			// Сессия уже могла быть завершена. Всё равно уводим на вход по паролю.
		}

		logout();
		window.location.assign('/login');
	};

	if (!ready) {
		return (
			<p className='text-[13px] text-[var(--foreground-secondary)]'>
				Загрузка...
			</p>
		);
	}

	return (
		<div className='w-full max-w-[360px] px-4'>
			<div className='flex flex-col items-center gap-6 w-full p-6 bg-[var(--card)] border-[0.5px] border-[var(--border-primary)] rounded-[16px]'>
				<div className='flex flex-col items-center gap-1.5 text-center'>
					<h1 className='text-[18px] font-semibold text-[var(--foreground-primary)]'>
						Финкнижка
					</h1>
					<p
						className='text-[13px] text-[var(--foreground-secondary)]'
						aria-live='polite'
					>
						{loading ? 'Разблокировка...' : 'Введите пин-код'}
					</p>
				</div>

				<PinPad
					value={pin}
					onChange={next => {
						setError('');
						setPin(next);
					}}
					onComplete={unlock}
					disabled={loading}
					error={error}
				/>

				<div className='flex flex-col gap-3 w-full'>
					{biometric && (
						<Button
							className='w-full h-10'
							disabled={loading}
							onClick={() => void unlockWithBiometric()}
						>
							Разблокировать по биометрии
						</Button>
					)}

					<Button
						className='w-full h-10'
						disabled={loading}
						onClick={loginWithPassword}
					>
						Войти с паролем
					</Button>
				</div>
			</div>
		</div>
	);
};
