'use client';

import React, { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';

import { Goal, useGoals } from '@/src/entities/goal';
import { GoalCard } from './goal-card';
import { GoalCardSkeleton } from './goal-card-skeleton';

interface Props {
	status: string;
	onGoalClick: (goal: Goal) => void;
}

const isAchieved = (goal: Goal) =>
	goal.targetAmount > 0 && goal.savedAmount >= goal.targetAmount;

export const GoalsList: React.FC<Props> = ({ status, onGoalClick }) => {
	const { goals, currencyCode, currencySymbol, isLoading, isError } =
		useGoals();
	const isActive = status === 'Активные';
	const currency = currencySymbol || currencyCode;
	const listRef = useRef<HTMLDivElement>(null);

	const visibleGoals = goals.filter(goal =>
		isActive ? !isAchieved(goal) : isAchieved(goal),
	);
	const showGrid = !isLoading && !isError && visibleGoals.length > 0;

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
					? 'grid content-start items-start grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3'
					: undefined
			}
		>
			{isLoading ? (
				<div className='grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3'>
					{Array.from({ length: 6 }, (_, index) => (
						<GoalCardSkeleton key={index} />
					))}
				</div>
			) : isError ? (
				<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
					Не удалось загрузить цели
				</p>
			) : visibleGoals.length === 0 ? (
				<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
					{isActive ? 'Нет активных целей' : 'Нет достигнутых целей'}
				</p>
			) : (
				visibleGoals.map(goal => (
					<GoalCard
						key={goal.id}
						goal={goal}
						currency={currency}
						onClick={() => onGoalClick(goal)}
					/>
				))
			)}
		</div>
	);
};
