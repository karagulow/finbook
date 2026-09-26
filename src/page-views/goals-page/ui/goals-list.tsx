import React from 'react';

import { useGoals } from '../hooks/use-goals';
import { Goal } from '../model/types';
import { GoalCard } from './goal-card';
import { GoalCardSkeleton } from './goal-card-skeleton';

interface Props {
	status: string;
}

const isAchieved = (goal: Goal) =>
	goal.targetAmount > 0 && goal.savedAmount >= goal.targetAmount;

export const GoalsList: React.FC<Props> = ({ status }) => {
	const { goals, currencyCode, currencySymbol, isLoading, isError } =
		useGoals();
	const isActive = status === 'Активные';
	const currency = currencySymbol || currencyCode;

	if (isLoading) {
		return (
			<div className='grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3'>
				{Array.from({ length: 9 }, (_, index) => (
					<GoalCardSkeleton key={index} />
				))}
			</div>
		);
	}

	if (isError) {
		return (
			<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
				Не удалось загрузить цели
			</p>
		);
	}

	const visibleGoals = goals.filter(goal =>
		isActive ? !isAchieved(goal) : isAchieved(goal),
	);

	if (visibleGoals.length === 0) {
		return (
			<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
				{isActive ? 'Нет активных целей' : 'Нет достигнутых целей'}
			</p>
		);
	}

	return (
		<div className='grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3'>
			{visibleGoals.map(goal => (
				<GoalCard key={goal.id} goal={goal} currency={currency} />
			))}
		</div>
	);
};
