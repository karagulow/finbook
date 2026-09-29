'use client';

import React, { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';

import { Debt, DebtType, useDebts } from '@/src/entities/debt';
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

export const DebtsList: React.FC<Props> = ({ type, onDebtClick }) => {
	const { debts, currencyCode, currencySymbol, isLoading, isError } =
		useDebts();
	const currency = currencySymbol || currencyCode || '₽';
	const listRef = useRef<HTMLDivElement>(null);

	const visibleDebts = debts.filter(debt => debt.type === type);
	const showGrid = !isLoading && !isError && visibleDebts.length > 0;

	useEffect(() => {
		if (listRef.current) {
			autoAnimate(listRef.current, { duration: 250, easing: 'ease-in-out' });
		}
	}, []);

	return (
		<div
			ref={listRef}
			className={
				showGrid
					? 'grid content-start items-start grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
					: undefined
			}
		>
			{isLoading ? (
				<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{Array.from({ length: 8 }, (_, index) => (
						<DebtCardSkeleton key={index} />
					))}
				</div>
			) : isError ? (
				<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
					Не удалось загрузить долги
				</p>
			) : visibleDebts.length === 0 ? (
				<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
					{emptyMessage[type]}
				</p>
			) : (
				visibleDebts.map(debt => (
					<DebtCard
						key={debt.id}
						debt={debt}
						currency={currency}
						onClick={() => onDebtClick(debt)}
					/>
				))
			)}
		</div>
	);
};
