'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import autoAnimate from '@formkit/auto-animate';

import { Debt, DebtType, useDebts } from '@/src/entities/debt';
import { Button, Divider } from '@/src/shared/ui';
import { AddDebtModal } from '@/src/widgets/add-debt-modal';
import { DebtDetailsModal } from '@/src/widgets/debt-details-modal';
import { DebtOverviewItem } from './debt-overview-item';
import { DebtOverviewItemSkeleton } from './debt-overview-item-skeleton';

const PREVIEW_LIMIT = 3;

const summaryLabels: { type: DebtType; label: string }[] = [
	{ type: 'OWED_BY_ME', label: 'Я должен' },
	{ type: 'OWED_TO_ME', label: 'Мне должны' },
];

const remainingOf = (debt: Debt) =>
	Math.max(0, debt.targetAmount - debt.savedAmount);

const isOpen = (debt: Debt) => !debt.paid && remainingOf(debt) > 0;

const formatAmount = (value: number) =>
	value.toLocaleString('ru-RU', {
		maximumFractionDigits: 2,
	});

export const DebtsOverview: React.FC = () => {
	const { debts, currencyCode, currencySymbol, isLoading, isError } =
		useDebts();
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const currency = currencySymbol || currencyCode || '₽';

	const openDebts = debts.filter(isOpen);
	const previewDebts = openDebts.slice(0, PREVIEW_LIMIT);
	const hiddenCount = Math.max(0, openDebts.length - previewDebts.length);
	const selectedDebt = debts.find(debt => debt.id === selectedDebtId) ?? null;
	const showList = !isLoading && !isError && openDebts.length > 0;

	useEffect(() => {
		if (listRef.current) {
			autoAnimate(listRef.current, { duration: 250, easing: 'ease-in-out' });
		}
	}, [showList]);

	return (
		<section className='flex flex-col gap-4 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4 pt-3 sm:gap-3 sm:p-5'>
			<div className='flex items-center justify-between gap-3 sm:px-2.5'>
				<h2 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
					Долги
				</h2>
				<Link
					href='/debts'
					className='font-medium text-[13px] text-[var(--foreground-secondary)] transition hover:text-[var(--foreground-primary)]'
				>
					Посмотреть все
				</Link>
			</div>

			{isLoading ? (
				<div className='flex flex-col'>
					<div className='grid animate-pulse grid-cols-2 gap-3 sm:px-2.5'>
						{summaryLabels.map(item => (
							<div key={item.type} className='flex flex-col gap-1.5'>
								<div className='h-[13px] w-16 rounded-[8px] bg-[var(--button-secondary)]' />
								<div className='h-[15px] w-24 rounded-[8px] bg-[var(--button-secondary)]' />
							</div>
						))}
					</div>
					{Array.from({ length: 2 }, (_, index) => (
						<div key={index} className='flex flex-col'>
							<Divider className='my-4 sm:hidden' />
							<DebtOverviewItemSkeleton />
						</div>
					))}
				</div>
			) : isError ? (
				<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
					Не удалось загрузить долги
				</p>
			) : openDebts.length === 0 ? (
				<div className='flex flex-col items-center gap-3'>
					<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
						Нет активных долгов
					</p>
					<Button
						className='w-full sm:w-auto'
						onClick={() => setIsAddOpen(true)}
					>
						Добавить
					</Button>
				</div>
			) : (
				<>
					<div className='grid grid-cols-2 gap-3 sm:px-2.5'>
						{summaryLabels.map(item => {
							const total = openDebts
								.filter(debt => debt.type === item.type)
								.reduce((sum, debt) => sum + remainingOf(debt), 0);

							return (
								<div key={item.type} className='flex min-w-0 flex-col'>
									<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
										{item.label}
									</span>
									<span className='truncate font-medium text-[15px] text-[var(--foreground-primary)]'>
										{formatAmount(total)} {currency}
									</span>
								</div>
							);
						})}
					</div>

					<Divider className='sm:mx-2.5' />

					<div ref={listRef} className='flex flex-col'>
						{previewDebts.map((debt, index) => (
							<div key={debt.id} className='flex flex-col'>
								{index > 0 && <Divider className='my-4 sm:hidden' />}
								<DebtOverviewItem
									debt={debt}
									currency={currency}
									emphasized={previewDebts.length === 1}
									onClick={() => setSelectedDebtId(debt.id)}
								/>
							</div>
						))}
					</div>

					{hiddenCount > 0 && (
						<Link
							href='/debts'
							className='w-fit font-medium text-[13px] text-[var(--foreground-secondary)] transition hover:text-[var(--foreground-primary)]'
						>
							ещё {hiddenCount}
						</Link>
					)}
				</>
			)}

			<AddDebtModal
				isOpen={isAddOpen}
				onClose={() => setIsAddOpen(false)}
				currency={currency}
				initialType='OWED_BY_ME'
			/>

			<DebtDetailsModal
				isOpen={selectedDebtId !== null}
				onClose={() => setSelectedDebtId(null)}
				debt={selectedDebt}
				currency={currency}
			/>
		</section>
	);
};
