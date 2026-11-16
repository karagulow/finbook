'use client';

import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { Cog, Goal, HandCoins } from 'lucide-react';

import { StickyHeader } from '@/src/shared/ui';
import { LinkItem } from './link-item';
import { debtsQueryOptions } from '@/src/entities/debt/hooks/use-debts';
import { goalsQueryOptions } from '@/src/entities/goal/hooks/use-goals';
import { userQueryOptions } from '@/src/entities/user/model/use-user';
import { pinSettingsQueryOptions } from '@/src/entities/user/model/use-pin-settings';
import { sessionsQueryOptions } from '@/src/entities/session/model/use-sessions';

export const MorePage: React.FC = () => {
	const STROKE_WIDTH = 1;

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
		]);
	};

	return (
		<>
			<StickyHeader title='Ещё' />

			<div className='flex flex-col gap-5 sm:gap-[30px]'>
				<h1 className='font-medium text-[24px] text-[var(--foreground-primary)]'>
					Ещё
				</h1>

				<div className='flex flex-col gap-2.5'>
					<LinkItem
						title='Цели'
						description='Планируй, копи, достигай'
						path='/goals'
						icon={<Goal strokeWidth={STROKE_WIDTH} />}
						prefetch={prefetchGoals}
					/>
					<LinkItem
						title='Долги'
						description='Учитывай, плати, освобождайся'
						path='/debts'
						icon={<HandCoins strokeWidth={STROKE_WIDTH} />}
						prefetch={prefetchDebts}
					/>
					<LinkItem
						title='Настройки'
						description='Меняй, настраивай, управляй'
						path='/settings'
						icon={<Cog strokeWidth={STROKE_WIDTH} />}
						prefetch={prefetchSettings}
					/>
				</div>
			</div>
		</>
	);
};
