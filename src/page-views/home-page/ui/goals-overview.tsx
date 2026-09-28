'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import autoAnimate from '@formkit/auto-animate';

import { Goal, useGoals } from '@/src/entities/goal';
import { Button, Divider } from '@/src/shared/ui';
import { CreateGoalModal } from '@/src/widgets/create-goal-modal';
import { GoalDetailsModal } from '@/src/widgets/goal-details-modal';
import { GoalOverviewItem } from './goal-overview-item';
import { GoalOverviewItemSkeleton } from './goal-overview-item-skeleton';

const PREVIEW_LIMIT = 3;

const isAchieved = (goal: Goal) =>
	goal.targetAmount > 0 && goal.savedAmount >= goal.targetAmount;

export const GoalsOverview: React.FC = () => {
	const { goals, currencyCode, currencySymbol, isLoading, isError } =
		useGoals();
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const currency = currencySymbol || currencyCode || '₽';

	const activeGoals = goals.filter(goal => !isAchieved(goal));
	const previewGoals = activeGoals.slice(0, PREVIEW_LIMIT);
	const hiddenCount = Math.max(0, activeGoals.length - previewGoals.length);
	const selectedGoal = goals.find(goal => goal.id === selectedGoalId) ?? null;

	useEffect(() => {
		if (listRef.current) {
			autoAnimate(listRef.current, { duration: 250, easing: 'ease-in-out' });
		}
	}, []);

	return (
		<section className='flex flex-col gap-4 sm:gap-3 rounded-[16px] border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] pt-3 p-4 sm:p-5'>
			<div className='flex items-center justify-between gap-3 sm:px-2.5'>
				<h2 className='font-bold text-[17px] text-[var(--foreground-primary)]'>
					Цели
				</h2>
				<Link
					href='/goals'
					className='font-medium text-[13px] text-[var(--foreground-secondary)] transition hover:text-[var(--foreground-primary)]'
				>
					Посмотреть все
				</Link>
			</div>

			{isLoading ? (
				<div className='flex flex-col'>
					{Array.from({ length: 2 }, (_, index) => (
						<div key={index} className='flex flex-col'>
							{index > 0 && <Divider className='my-4 sm:hidden' />}
							<GoalOverviewItemSkeleton />
						</div>
					))}
				</div>
			) : isError ? (
				<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
					Не удалось загрузить цели
				</p>
			) : activeGoals.length === 0 ? (
				<div className='flex flex-col items-center gap-3'>
					<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
						Нет активных целей
					</p>
					<Button
						className='w-full sm:w-auto'
						onClick={() => setIsCreateOpen(true)}
					>
						Создать
					</Button>
				</div>
			) : (
				<>
					<div ref={listRef} className='flex flex-col'>
						{previewGoals.map((goal, index) => (
							<div key={goal.id} className='flex flex-col'>
								{index > 0 && <Divider className='my-4 sm:hidden' />}
								<GoalOverviewItem
									goal={goal}
									currency={currency}
									emphasized={previewGoals.length === 1}
									onClick={() => setSelectedGoalId(goal.id)}
								/>
							</div>
						))}
					</div>
					{hiddenCount > 0 && (
						<Link
							href='/goals'
							className='w-fit font-medium text-[13px] text-[var(--foreground-secondary)] transition hover:text-[var(--foreground-primary)]'
						>
							ещё {hiddenCount}
						</Link>
					)}
				</>
			)}

			<CreateGoalModal
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
				currency={currency}
			/>

			<GoalDetailsModal
				isOpen={selectedGoalId !== null}
				onClose={() => setSelectedGoalId(null)}
				goal={selectedGoal}
				currency={currency}
			/>
		</section>
	);
};
