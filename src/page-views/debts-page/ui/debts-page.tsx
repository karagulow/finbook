'use client';

import React, { useState } from 'react';
import { Button, StickyHeader, Tabs } from '@/src/shared/ui';
import { DebtType } from '@/src/entities/debt';
import { DebtsList } from './debts-list';

const debtTabs = ['Я должен', 'Мне должны'] as const;

const debtTypeByTab: Record<(typeof debtTabs)[number], DebtType> = {
	'Я должен': 'OWED_BY_ME',
	'Мне должны': 'OWED_TO_ME',
};

export const DebtsPage: React.FC = () => {
	const [activeTab, setActiveTab] =
		useState<(typeof debtTabs)[number]>('Я должен');

	return (
		<>
			<StickyHeader title='Долги' />

			<div className='flex flex-col gap-5 sm:gap-[30px]'>
				<div className='flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:justify-between'>
					<h1 className='font-medium text-[24px] text-[var(--foreground-primary)]'>
						Долги
					</h1>

					<Button className='w-full sm:w-auto'>Добавить долг</Button>
				</div>

				<div className='flex flex-col gap-5'>
					<Tabs
						items={[...debtTabs]}
						activeItem={activeTab}
						setActiveItem={item =>
							setActiveTab(item as (typeof debtTabs)[number])
						}
						tabName='debt-type'
						className='w-full sm:w-75'
					/>

					<DebtsList type={debtTypeByTab[activeTab]} />
				</div>
			</div>
		</>
	);
};
