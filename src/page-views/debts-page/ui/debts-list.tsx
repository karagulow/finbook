'use client';

import React, { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';

import { Debt, DebtType, debtCurrencyLabel, useDebts } from '@/src/entities/debt';
import { DebtCard } from './debt-card';
import { DebtCardSkeleton } from './debt-card-skeleton';

interface Props {
	type: DebtType;
	onDebtClick: (debt: Debt) => void;
}

const emptyMessage: Record<DebtType, string> = {
	OWED_BY_ME: 'Нет долгов',
	OWED_TO_ME: 'Вам никто не должен',
};

const gridClassName =
	'grid content-start items-start grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4';

const remainingOf = (debt: Debt) =>
	Math.max(0, debt.targetAmount - debt.savedAmount);

const isOpen = (debt: Debt) => !debt.paid && remainingOf(debt) > 0;

export const DebtsList: React.FC<Props> = ({ type, onDebtClick }) => {
	const { debts, currencyCode, currencySymbol, isLoading, isError } =
		useDebts();
	const currency = currencySymbol || currencyCode || '₽';
	const activeRef = useRef<HTMLDivElement>(null);
	const completedRef = useRef<HTMLDivElement>(null);

	const visibleDebts = debts.filter(debt => debt.type === type);
	const activeDebts = visibleDebts.filter(isOpen);
	const completedDebts = visibleDebts.filter(debt => !isOpen(debt));

	useEffect(() => {
		const options = { duration: 250, easing: 'ease-in-out' as const };
		if (activeRef.current) autoAnimate(activeRef.current, options);
		if (completedRef.current) autoAnimate(completedRef.current, options);
	}, [activeDebts.length > 0, completedDebts.length > 0]);

	if (isLoading) {
		return (
			<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{Array.from({ length: 8 }, (_, index) => (
					<DebtCardSkeleton key={index} />
				))}
			</div>
		);
	}

	if (isError) {
		return (
			<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
				Не удалось загрузить долги
			</p>
		);
	}

	if (visibleDebts.length === 0) {
		return (
			<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
				{emptyMessage[type]}
			</p>
		);
	}

	return (
		<div className='flex flex-col gap-6'>
			<section className='flex flex-col gap-2.5'>
				<h2 className='font-medium text-[15px] text-[var(--foreground-secondary)]'>
					Активные
				</h2>
				{activeDebts.length === 0 ? (
					<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
						Нет активных долгов
					</p>
				) : (
					<div ref={activeRef} className={gridClassName}>
						{activeDebts.map(debt => (
							<DebtCard
								key={debt.id}
								debt={debt}
								currency={debtCurrencyLabel(debt, currency)}
								onClick={() => onDebtClick(debt)}
							/>
						))}
					</div>
				)}
			</section>

			{completedDebts.length > 0 && (
				<section className='flex flex-col gap-2.5'>
					<h2 className='font-medium text-[15px] text-[var(--foreground-secondary)]'>
						Завершённые
					</h2>
					<div ref={completedRef} className={gridClassName}>
						{completedDebts.map(debt => (
							<DebtCard
								key={debt.id}
								debt={debt}
								currency={debtCurrencyLabel(debt, currency)}
								onClick={() => onDebtClick(debt)}
							/>
						))}
					</div>
				</section>
			)}
		</div>
	);
};
