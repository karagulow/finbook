'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { api, lockBody, unlockBody } from '@/src/shared/lib';
import { PIN_OFFER_STORAGE_KEY } from '@/src/shared/lib/pin-constants';
import { PinCreateSteps } from './pin-create-steps';

const PIN_OFFER_PENDING = '1';
const PIN_OFFER_SHOWN = 'shown';
let offerReplayUntil = 0;

function shouldShowPinOffer() {
	const value = sessionStorage.getItem(PIN_OFFER_STORAGE_KEY);
	const now = Date.now();

	if (value === PIN_OFFER_PENDING) {
		sessionStorage.setItem(PIN_OFFER_STORAGE_KEY, PIN_OFFER_SHOWN);
		offerReplayUntil = now + 1000;
		return true;
	}

	if (now < offerReplayUntil) {
		offerReplayUntil = 0;
		return true;
	}

	return false;
}

export const PinSetupPrompt: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (shouldShowPinOffer()) {
			setOpen(true);
		}
	}, []);

	useEffect(() => {
		if (!open) {
			return;
		}

		lockBody();
		return () => unlockBody();
	}, [open]);

	const closeOffer = () => {
		sessionStorage.removeItem(PIN_OFFER_STORAGE_KEY);
		setOpen(false);
	};

	const skip = async () => {
		closeOffer();

		try {
			await api.post('/api/auth/pin/dismiss');
		} catch {
			// Отказ уже сохранён в этой вкладке и не вернётся после обновления.
		}
	};

	if (!mounted || !open) {
		return null;
	}

	return createPortal(
		<div className='fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-[2px] px-4'>
			<div className='w-full max-w-[360px] rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-6 shadow-xl'>
				<PinCreateSteps
					description='Он понадобится при следующем открытии Финкнижки на этом устройстве.'
					onComplete={closeOffer}
					onSkip={skip}
				/>
			</div>
		</div>,
		document.body,
	);
};
