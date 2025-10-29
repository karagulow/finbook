'use client';

import React, { useState } from 'react';

import { SettingsBlockItem } from '../settings-block-layout';
import { Button } from '@/src/shared/ui';
import { ChangeCurrencyModal } from './change-currency-modal';
import { Currency } from '../../model/types';

interface ChangeCurrencyProps {
	currency: Currency;
}

export const ChangeCurrency: React.FC<ChangeCurrencyProps> = ({ currency }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	return (
		<>
			<SettingsBlockItem>
				<div className='flex flex-col gap-1.5'>
					<span className='text-[15px] text-[var(--foreground-primary)]'>
						Основная валюта
					</span>
					<span>Выбор основной валюты аккаунта.</span>
				</div>
				<Button className='w-full sm:w-fit' onClick={openModal}>
					Настроить
				</Button>
			</SettingsBlockItem>

			<ChangeCurrencyModal
				isOpen={isModalOpen}
				onClose={closeModal}
				currency={currency}
			/>
		</>
	);
};
