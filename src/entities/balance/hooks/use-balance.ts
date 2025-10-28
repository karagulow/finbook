'use client';

import { useState, useCallback } from 'react';

interface BalanceResponse {
	total: number;
	currencyCode: string;
	currencySymbol: string | null;
}

export const useBalance = () => {
	const [total, setTotal] = useState(0);
	const [currencyCode, setCurrencyCode] = useState('');
	const [currencySymbol, setCurrencySymbol] = useState<string | null>(null);

	const fetchBalance = useCallback(async () => {
		try {
			const res = await fetch('/api/balance', {
				method: 'GET',
				credentials: 'include',
			});

			if (!res.ok) {
				throw new Error('Ошибка при получении баланса');
			}

			const data: BalanceResponse = await res.json();

			setTotal(data.total);
			setCurrencyCode(data.currencyCode);
			setCurrencySymbol(data.currencySymbol);
		} catch (err) {
			console.error('[useBalance] Ошибка:', err);
		}
	}, []);

	return { total, currencyCode, currencySymbol, fetchBalance };
};
