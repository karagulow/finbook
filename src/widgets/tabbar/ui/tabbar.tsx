'use client';

import React from 'react';
import { QueryClient } from '@tanstack/react-query';

import { AlignJustify, ChartPie, LayoutGrid, ReceiptText } from 'lucide-react';

import { TabbarItem } from './tabbar-item';
import { transactionsQueryOptions } from '@/src/page-views/transactions-page/hooks/use-transactions';
import { prefetchHomePage } from '@/src/page-views/home-page/lib/prefetch-home-page';

const ICON_SIZE = 20;
const ICON_STROKE_WIDTH = 1.5;

export const Tabbar: React.FC = () => {
	const prefetchTransactions = (queryClient: QueryClient) => {
		void queryClient.prefetchInfiniteQuery(transactionsQueryOptions());
	};

	return (
		<nav className='fixed left-5 bottom-5 flex lg:hidden flex-row items-center w-[calc(100%-40px)] bg-[var(--background-primary)]/70 backdrop-blur-md border-[0.5px] border-[var(--border-primary)] rounded-full z-10 h-15'>
			<TabbarItem
				path='/home'
				icon={<LayoutGrid size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Главная'
				prefetch={prefetchHomePage}
			/>
			<TabbarItem
				path='/transactions'
				icon={<ReceiptText size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Транзакции'
				prefetch={prefetchTransactions}
			/>
			<TabbarItem
				path='/analytics'
				icon={<ChartPie size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Аналитика'
			/>
			<TabbarItem
				path='/more'
				icon={<AlignJustify size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Ещё'
			/>
		</nav>
	);
};
