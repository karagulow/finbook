'use client';

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

import { Button, Select } from '@/src/shared/ui';
import { Currency } from '@/src/entities/user/model/types';
import { currenciesQueryOptions } from '@/src/entities/currency/model/queries';
import { api } from '@/src/shared/lib';

interface Props {
	currency: Currency;
	onClose: () => void;
}

export const ChangeCurrencyContent: React.FC<Props> = ({
	currency,
	onClose,
}) => {
	const [selectedCurrencyId, setSelectedCurrencyId] = useState(currency.id);
	const [loading, setLoading] = useState(false);

	const { data: currencies = [], isLoading: isCurrenciesLoading } = useQuery(
		currenciesQueryOptions(),
	);

	const isDisabled =
		loading || isCurrenciesLoading || selectedCurrencyId === currency.id;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedCurrencyId) {
			toast.error('Выберите валюту');
			return;
		}

		try {
			setLoading(true);

			await api.post('/api/user/change-currency', {
				currencyId: selectedCurrencyId,
			});

			toast.success('Валюта успешно изменена');
			onClose();
		} catch (error: unknown) {
			let message = 'Ошибка при смене валюты';

			if (axios.isAxiosError(error)) {
				message = error.response?.data?.error || error.message || message;
			} else if (error instanceof Error) {
				message = error.message;
			}

			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col gap-5 h-full'>
			<h2 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
				Сменить валюту
			</h2>

			<form onSubmit={handleSubmit} className='flex flex-col gap-5 h-full'>
				<div className='flex flex-col gap-5 flex-1 overflow-y-auto'>
					<Select
						label='Валюта'
						value={selectedCurrencyId}
						onChange={val => setSelectedCurrencyId(val as string)}
						options={currencies.map(c => ({
							value: c.id,
							label: `${c.name} (${c.code})`,
						}))}
						placeholder='Выберите валюту'
					/>
				</div>

				<Button type='submit' disabled={isDisabled}>
					{loading ? 'Сохранение…' : 'Сохранить'}
				</Button>
			</form>
		</div>
	);
};
