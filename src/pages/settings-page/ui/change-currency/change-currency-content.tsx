'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import { Button, Select } from '@/src/shared/ui';
import { Currency } from '../../model/types';

interface Props {
	currency: Currency;
	onClose: () => void;
}

export const ChangeCurrencyContent: React.FC<Props> = ({
	currency,
	onClose,
}) => {
	const [currencies, setCurrencies] = useState<Currency[]>([]);
	const [selectedCurrencyId, setSelectedCurrencyId] = useState<string>(
		currency.id
	);
	const [loading, setLoading] = useState(false);

	const isDisabled = loading || selectedCurrencyId === currency.id;

	useEffect(() => {
		const fetchCurrencies = async () => {
			try {
				const { data } = await axios.get<Currency[]>('/api/currencies');
				setCurrencies(data);
			} catch (error) {
				toast.error('Не удалось загрузить список валют');
			}
		};

		fetchCurrencies();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedCurrencyId) {
			toast.error('Выберите валюту');
			return;
		}

		try {
			setLoading(true);
			await axios.post('/api/user/change-currency', {
				currencyId: selectedCurrencyId,
			});
			toast.success('Валюта успешно изменена');
			onClose();
		} catch (error: any) {
			toast.error(error.response?.data?.error || 'Ошибка при смене валюты');
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
					{loading ? 'Сохраняю…' : 'Сохранить'}
				</Button>
			</form>
		</div>
	);
};
