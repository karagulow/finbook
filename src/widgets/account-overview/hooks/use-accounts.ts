'use client';

import { useEffect, useState } from 'react';
import { getAccounts } from '../lib/get-accounts';

export type Account = {
	id: string;
	name: string;
	balance: number;
	currency: string;
};

interface BalanceResponse {
	total: number;
	currencyCode: string;
	currencySymbol: string | null;
}

export const useAccounts = () => {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [totalBalance, setTotalBalance] = useState(0);
	const [currencyCode, setCurrencyCode] = useState('');
	const [currencySymbol, setCurrencySymbol] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAccounts = async () => {
			setLoading(true);
			try {
				const accountsData = await getAccounts();

				const balanceRes = await fetch('/api/balance', {
					method: 'GET',
					credentials: 'include',
				});
				const balanceData: BalanceResponse = await balanceRes.json();

				setAccounts(accountsData);
				setTotalBalance(balanceData.total);
				setCurrencyCode(balanceData.currencyCode);
				setCurrencySymbol(balanceData.currencySymbol);
			} catch (err) {
				console.error('Ошибка загрузки счетов', err);
			} finally {
				setLoading(false);
			}
		};

		fetchAccounts();
	}, []);

	return { accounts, totalBalance, currencyCode, currencySymbol, loading };
};
