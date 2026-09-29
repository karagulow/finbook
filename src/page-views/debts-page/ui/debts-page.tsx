'use client';

import React, { useState } from 'react';
import { Button, StickyHeader, Tabs } from '@/src/shared/ui';
import { DebtType, useDebts } from '@/src/entities/debt';
import { AddDebtModal } from '@/src/widgets/add-debt-modal';
import { DebtDetailsModal } from '@/src/widgets/debt-details-modal';
import { DebtsList } from './debts-list';

const debtTabs = ['Я должен', 'Мне должны'] as const;

const debtTypeByTab: Record<(typeof debtTabs)[number], DebtType> = {
	'Я должен': 'OWED_BY_ME',
	'Мне должны': 'OWED_TO_ME',
};

export const DebtsPage: React.FC = () => {
	const [activeTab, setActiveTab] =
		useState<(typeof debtTabs)[number]>('Я должен');
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
	const { debts, currencyCode, currencySymbol } = useDebts();
	const currency = currencySymbol || currencyCode || '₽';
	const selectedDebt = debts.find(debt => debt.id === selectedDebtId) ?? null;

	return (
		<>
			<StickyHeader title='Долги' />

			<div className='flex flex-col gap-5 sm:gap-[30px]'>
				<div className='flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:justify-between'>
					<h1 className='font-medium text-[24px] text-[var(--foreground-primary)]'>
						Долги
					</h1>

					<Button
						className='w-full sm:w-auto'
						onClick={() => setIsAddOpen(true)}
					>
						Добавить долг
					</Button>
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

					<DebtsList
						type={debtTypeByTab[activeTab]}
						onDebtClick={debt => setSelectedDebtId(debt.id)}
					/>
				</div>
			</div>

			<AddDebtModal
				isOpen={isAddOpen}
				onClose={() => setIsAddOpen(false)}
				currency={currency}
				initialType={debtTypeByTab[activeTab]}
			/>

			<DebtDetailsModal
				isOpen={selectedDebtId !== null}
				onClose={() => setSelectedDebtId(null)}
				debt={selectedDebt}
				currency={currency}
			/>
		</>
	);
};
