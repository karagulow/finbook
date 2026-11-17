'use client';

import React from 'react';
import { QueryClient } from '@tanstack/react-query';

import {
	ChartPie,
	Cog,
	Goal,
	HandCoins,
	LayoutGrid,
	ReceiptText,
} from 'lucide-react';

import { NavItem } from './nav-item';
import { transactionsQueryOptions } from '@/src/page-views/transactions-page/hooks/use-transactions';
import { debtsQueryOptions } from '@/src/entities/debt/hooks/use-debts';
import { goalsQueryOptions } from '@/src/entities/goal/hooks/use-goals';
import { userQueryOptions } from '@/src/entities/user/model/use-user';
import {
	pinSettingsQueryOptions,
	platformBiometricQueryOptions,
} from '@/src/entities/user/model/use-pin-settings';
import { sessionsQueryOptions } from '@/src/entities/session/model/use-sessions';
import { categoriesQueryOptions } from '@/src/page-views/settings-page/model/use-categories';
import { currenciesQueryOptions } from '@/src/entities/currency/model/queries';
import { prefetchHomePage } from '@/src/page-views/home-page/lib/prefetch-home-page';
import { prefetchAnalyticsPage } from '@/src/page-views/analytics-page/lib/prefetch-analytics-page';

const ICON_SIZE = 16;
const ICON_STROKE_WIDTH = 1.5;

const prefetchTransactions = (queryClient: QueryClient) => {
	void queryClient.prefetchInfiniteQuery(transactionsQueryOptions());
};

const prefetchGoals = (queryClient: QueryClient) => {
	void queryClient.prefetchQuery(goalsQueryOptions());
};

const prefetchDebts = (queryClient: QueryClient) => {
	void queryClient.prefetchQuery(debtsQueryOptions());
};

const prefetchSettings = (queryClient: QueryClient) => {
	void Promise.all([
		queryClient.prefetchQuery(userQueryOptions()),
		queryClient.prefetchQuery(pinSettingsQueryOptions()),
		queryClient.prefetchQuery(sessionsQueryOptions()),
		queryClient.prefetchQuery(categoriesQueryOptions()),
		queryClient.prefetchQuery(currenciesQueryOptions()),
		queryClient.prefetchQuery(platformBiometricQueryOptions()),
	]);
};

export const Navigation: React.FC = () => {
	return (
		<nav className='flex flex-col w-full gap-2'>
			<NavItem
				path='/home'
				icon={<LayoutGrid size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Главная'
				prefetch={prefetchHomePage}
			/>
			<NavItem
				path='/transactions'
				icon={<ReceiptText size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Транзакции'
				prefetch={prefetchTransactions}
			/>
			<NavItem
				path='/analytics'
				icon={<ChartPie size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Аналитика'
				prefetch={prefetchAnalyticsPage}
			/>
			<NavItem
				path='/goals'
				icon={<Goal size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Цели'
				prefetch={prefetchGoals}
			/>
			<NavItem
				path='/debts'
				icon={<HandCoins size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Долги'
				prefetch={prefetchDebts}
			/>
			<NavItem
				path='/settings'
				icon={<Cog size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Настройки'
				prefetch={prefetchSettings}
			/>
		</nav>
	);
};
