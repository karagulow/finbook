import React from 'react';

import { goals } from '../model/goals';
import { GoalCard } from './goal-card';

interface Props {
	status: string;
}

export const GoalsList: React.FC<Props> = ({ status }) => {
	const isActive = status === 'Активные';
	const visibleGoals = goals.filter(goal =>
		isActive ? goal.status === 'active' : goal.status === 'achieved',
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
				<GoalCard key={goal.id} goal={goal} />
			))}
		</div>
	);
};
