import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Goal, GoalProgress } from '@/src/entities/goal';
import { cn } from '@/src/shared/lib';
import { getGoalPace } from '../lib/get-goal-pace';

interface Props {
	goal: Goal;
	currency: string;
	emphasized?: boolean;
	onClick: () => void;
}

export const GoalOverviewItem: React.FC<Props> = ({
	goal,
	currency,
	emphasized = false,
	onClick,
}) => {
	const progress =
		goal.targetAmount > 0
			? Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100))
			: 0;
	const pace = getGoalPace(goal, currency);
	const paceIsUrgent =
		pace?.kind === 'overdue' ||
		pace?.kind === 'due-today' ||
		pace?.kind === 'behind';

	return (
		<button
			type='button'
			onClick={onClick}
			className='flex w-full cursor-pointer items-center gap-4 rounded-[12px] sm:py-2 sm:px-2.5 text-left transition hover:bg-none sm:hover:bg-[var(--muted)]'
		>
			<GoalProgress icon={goal.icon} progress={progress} />

			<div className='flex min-w-0 flex-1 flex-col gap-0.5'>
				<div className='flex items-baseline justify-between gap-3'>
					<span className='truncate font-medium text-[15px] text-[var(--foreground-primary)]'>
						{goal.name}
					</span>
					<span className='shrink-0 font-medium text-[15px] text-[var(--foreground-primary)]'>
						{progress}%
					</span>
				</div>
				<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
					до {format(new Date(goal.deadline), 'd MMMM yyyy', { locale: ru })}
				</span>
				{pace && (
					<span
						className={cn(
							'font-medium',
							paceIsUrgent || emphasized
								? 'text-[var(--foreground-primary)]'
								: 'text-[var(--foreground-secondary)]',
							emphasized ? 'text-[15px]' : 'text-[13px]',
						)}
					>
						{pace.text}
					</span>
				)}
			</div>
		</button>
	);
};
