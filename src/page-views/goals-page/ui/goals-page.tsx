'use client';

import React, { useState } from 'react';
import { Button, StickyHeader, Tabs } from '@/src/shared/ui';
import { CreateGoalModal } from '@/src/widgets/create-goal-modal';
import { GoalDetailsModal } from '@/src/widgets/goal-details-modal';
import { useGoals } from '../hooks/use-goals';
import { Goal } from '../model/types';
import { GoalsList } from './goals-list';

export const GoalsPage: React.FC = () => {
	const goalStatuses = ['Активные', 'Достигнутые'];
	const [activeGoalStatus, setActiveGoalStatus] = useState(goalStatuses[0]);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
	const { currencyCode, currencySymbol } = useGoals();
	const currency = currencySymbol || currencyCode || '₽';

	return (
		<>
			<StickyHeader title='Цели' />

			<div className='flex flex-col gap-5 sm:gap-[30px]'>
				<div className='flex flex-col items-start gap-2.5 sm:flex-row sm:justify-between sm:items-center'>
					<h1 className='font-medium text-[24px] text-[var(--foreground-primary)]'>
						Цели
					</h1>

					<Button
						className='w-full sm:w-auto'
						onClick={() => setIsCreateOpen(true)}
					>
						Создать цель
					</Button>
				</div>

				<div className='flex flex-col gap-5'>
					<Tabs
						items={goalStatuses}
						activeItem={activeGoalStatus}
						setActiveItem={setActiveGoalStatus}
						tabName='goal-status'
						className='w-full sm:w-75'
					/>

					<GoalsList
						status={activeGoalStatus}
						onGoalClick={setSelectedGoal}
					/>
				</div>
			</div>

			<CreateGoalModal
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
				currency={currency}
			/>

			<GoalDetailsModal
				isOpen={selectedGoal !== null}
				onClose={() => setSelectedGoal(null)}
				goal={selectedGoal}
				currency={currency}
			/>
		</>
	);
};
