import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Goal } from '../model/types';
import { GoalProgress } from './goal-progress';

interface Props {
	goal: Goal;
	currency: string;
}

const formatAmount = (value: number, currency: string) =>
	`${value.toLocaleString('ru-RU', {
		maximumFractionDigits: 2,
	})} ${currency}`;

export const GoalCard: React.FC<Props> = ({ goal, currency }) => {
	const progress =
		goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;

	return (
		<article className='flex items-center gap-4 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] p-4 transition hover:border-[var(--border-primary-hover)]'>
			<GoalProgress icon={goal.icon} progress={progress} />

			<div className='flex min-w-0 flex-col gap-0.5'>
				<span className='truncate font-medium text-[15px] text-[var(--foreground-primary)]'>
					{goal.name}
				</span>
				<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
					Срок:{' '}
					{format(new Date(goal.deadline), 'd MMMM yyyy', { locale: ru })}
				</span>
				<span className='whitespace-nowrap font-medium text-[15px] text-[var(--foreground-primary)]'>
					{formatAmount(goal.savedAmount, currency)}
					<span className='text-[var(--foreground-secondary)]'>
						{' '}
						/ {formatAmount(goal.targetAmount, currency)}
					</span>
				</span>
			</div>
		</article>
	);
};
