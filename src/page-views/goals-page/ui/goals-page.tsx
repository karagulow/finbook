'use client';

import React, { useState } from 'react';
import { Button, StickyHeader, Tabs } from '@/src/shared/ui';
import { GoalsList } from './goals-list';

export const GoalsPage: React.FC = () => {
	const goalStatuses = ['Активные', 'Достигнутые'];
	const [activeGoalStatus, setActiveGoalStatus] = useState(goalStatuses[0]);

	return (
		<>
			<StickyHeader title='Цели' />

			<div className='flex flex-col gap-5 sm:gap-[30px]'>
				<div className='flex flex-col items-start gap-2.5 sm:flex-row sm:justify-between sm:items-center'>
					<h1 className='font-medium text-[24px] text-[var(--foreground-primary)]'>
						Цели
					</h1>

					<Button className='w-full sm:w-auto'>Создать цель</Button>
				</div>

				<div className='flex flex-col gap-5'>
					<Tabs
						items={goalStatuses}
						activeItem={activeGoalStatus}
						setActiveItem={setActiveGoalStatus}
						tabName='goal-status'
						className='w-full sm:w-75'
					/>

					<GoalsList status={activeGoalStatus} />
				</div>
			</div>
		</>
	);
};
