'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { api } from '@/src/shared/lib';
import { safeNextPath } from '@/src/shared/lib/pin-constants';
import { useAuthStore } from '@/src/shared/store/authStore';
import { Button } from '@/src/shared/ui';
import { getPinErrorMessage } from '../lib/pin-error';
import { PinPad } from './pin-pad';

export const PinLockScreen: React.FC = () => {
	const searchParams = useSearchParams();
	const logout = useAuthStore(state => state.logout);
	const [ready, setReady] = useState(false);
	const [pin, setPin] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let cancelled = false;

		api
			.get<{ enabled: boolean }>('/api/auth/pin')
			.then(response => {
				if (cancelled) {
					return;
				}

				if (!response.data.enabled) {
					window.location.replace('/home');
					return;
				}

				setReady(true);
			})
			.catch(() => {
				if (!cancelled) {
					window.location.replace('/login');
				}
			});

		return () => {
			cancelled = true;
		};
	}, []);

	const unlock = async (value: string) => {
		if (loading) {
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
			<p className='text-[13px] text-[var(--foreground-secondary)]'>Загрузка...</p>
		);
	}

	return (
		<div className='w-full max-w-[360px] px-4'>
			<div className='flex flex-col items-center gap-6 w-full p-6 bg-[var(--card)] border-[0.5px] border-[var(--border-primary)] rounded-[16px]'>
				<div className='flex flex-col items-center gap-1.5 text-center'>
					<h1 className='text-[18px] font-semibold text-[var(--foreground-primary)]'>
						Финкнижка
					</h1>
					<p className='text-[13px] text-[var(--foreground-secondary)]'>
						Введите пин-код
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

				<Button
					className='w-full h-10'
					disabled={loading}
					onClick={loginWithPassword}
				>
					Войти с паролем
				</Button>
			</div>
		</div>
	);
};
