'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { api, toastOptions } from '@/src/shared/lib';
import { Button, DeleteButton, EditButton } from '@/src/shared/ui';
import { EditGoalModal } from '../../edit-goal-modal';
import {
	GoalOperationModal,
	GoalOperationType,
} from '../../goal-operation-modal';
import { GoalDetails } from '../model/types';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';
import { GoalDetailsProgress } from './goal-details-progress';

interface Props {
	goal: GoalDetails;
	currency: string;
	onClose: () => void;
}

const formatAmount = (value: number) =>
	value.toLocaleString('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

export const GoalDetailsContent: React.FC<Props> = ({
	goal,
	currency,
	onClose,
}) => {
	const queryClient = useQueryClient();
	const [isDeleting, setIsDeleting] = useState(false);
	const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [operationType, setOperationType] = useState<GoalOperationType | null>(
		null,
	);

	const progress =
		goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await api.delete(`/api/goals/${goal.id}`);
			await queryClient.invalidateQueries({ queryKey: ['goals'] });
			setIsConfirmDeleteOpen(false);
			toast.success('Цель удалена', toastOptions);
			onClose();
		} catch (err) {
			console.error('Ошибка удаления цели', err);
			toast.error('Не удалось удалить цель', toastOptions);
		}
		setIsDeleting(false);
	};

	return (
		<>
			<div className='flex h-full flex-col'>
				<h2 className='mb-5 font-bold text-[17px] text-[var(--foreground-primary)]'>
					Детали цели
				</h2>

				<div className='flex flex-1 flex-col gap-5 overflow-y-auto'>
					<div className='flex flex-col items-center gap-3'>
						<GoalDetailsProgress icon={goal.icon} progress={progress} />

						<span className='text-center font-semibold text-[20px] text-[var(--foreground-primary)]'>
							{formatAmount(goal.savedAmount)}
							<span className='font-medium text-[var(--foreground-secondary)]'>
								{' '}
								/ {formatAmount(goal.targetAmount)} {currency}
							</span>
						</span>

						<span className='font-medium text-[15px] text-[var(--foreground-primary)]'>
							{goal.name}
						</span>

						<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
							Срок:{' '}
							{format(new Date(goal.deadline), 'd MMMM yyyy', { locale: ru })}
						</span>

						{goal.description?.trim() && (
							<p className='whitespace-pre-wrap text-center font-medium text-[13px] leading-5 text-[var(--foreground-secondary)]'>
								{goal.description.trim()}
							</p>
						)}
					</div>

					<div className='grid grid-cols-2 gap-2.5'>
						<Button type='button' onClick={() => setOperationType('DEPOSIT')}>
							Пополнить
						</Button>
						<Button type='button' onClick={() => setOperationType('WITHDRAW')}>
							Снять
						</Button>
					</div>

					<div className='flex flex-col gap-2.5'>
						<h3 className='font-medium text-[15px] text-[var(--foreground-primary)]'>
							История
						</h3>

						{goal.operations.length === 0 ? (
							<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
								Операций пока нет
							</p>
						) : (
							<ul className='flex flex-col gap-2'>
								{goal.operations.map(operation => {
									const sign = operation.type === 'DEPOSIT' ? '+' : '−';

									return (
										<li
											key={operation.id}
											className='flex items-center justify-between gap-3 rounded-[12px] bg-[var(--button-tertiary)] px-3.5 py-3'
										>
											<div className='flex min-w-0 flex-col gap-0.5'>
												<span className='font-medium text-[15px] text-[var(--foreground-primary)]'>
													{sign} {formatAmount(operation.amount)} {currency}
												</span>
												<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
													{format(
														new Date(operation.date),
														'd MMMM yyyy, HH:mm',
														{
															locale: ru,
														},
													)}
												</span>
											</div>

											<div className='flex shrink-0 items-center gap-3'>
												<EditButton />
												<DeleteButton />
											</div>
										</li>
									);
								})}
							</ul>
						)}
					</div>
				</div>

				<div className='mt-5 flex flex-row items-center gap-2.5'>
					<Button className='w-full' onClick={() => setIsEditOpen(true)}>
						Изменить
					</Button>
					<Button
						className='w-full'
						variant='wrong'
						onClick={() => setIsConfirmDeleteOpen(true)}
					>
						Удалить
					</Button>
				</div>
			</div>

			<EditGoalModal
				isOpen={isEditOpen}
				onClose={() => setIsEditOpen(false)}
				goal={goal}
				currency={currency}
			/>

			{operationType && (
				<GoalOperationModal
					isOpen
					onClose={() => setOperationType(null)}
					type={operationType}
					currency={currency}
					goal={{
						id: goal.id,
						name: goal.name,
						icon: goal.icon,
						savedAmount: goal.savedAmount,
						targetAmount: goal.targetAmount,
					}}
				/>
			)}

			<ConfirmDeleteDialog
				isOpen={isConfirmDeleteOpen}
				onClose={() => setIsConfirmDeleteOpen(false)}
				onConfirm={handleDelete}
				goalName={goal.name}
				loading={isDeleting}
			/>
		</>
	);
};
