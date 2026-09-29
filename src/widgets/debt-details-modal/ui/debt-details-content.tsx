'use client';

import React, { useEffect, useRef, useState } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { Debt, DebtOperation, DebtType } from '@/src/entities/debt';
import { api, toastOptions } from '@/src/shared/lib';
import { useAnimatedNumber } from '@/src/shared/hooks';
import { Button, DeleteButton, EditButton } from '@/src/shared/ui';
import { DebtOperationModal } from '../../debt-operation-modal';
import { EditDebtModal } from '../../edit-debt-modal';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';
import { ConfirmDeleteOperationDialog } from './confirm-delete-operation-dialog';

interface Props {
	debt: Debt;
	currency: string;
	onClose: () => void;
}

const typeLabel: Record<DebtType, string> = {
	OWED_BY_ME: 'Я должен:',
	OWED_TO_ME: 'Мне должен:',
};

const actionLabel: Record<DebtType, string> = {
	OWED_BY_ME: 'Вернуть',
	OWED_TO_ME: 'Получить',
};

const formatAmount = (value: number) =>
	value.toLocaleString('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

export const DebtDetailsContent: React.FC<Props> = ({
	debt,
	currency,
	onClose,
}) => {
	const queryClient = useQueryClient();
	const [isDeleting, setIsDeleting] = useState(false);
	const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isOperationOpen, setIsOperationOpen] = useState(false);
	const [operationToEdit, setOperationToEdit] = useState<DebtOperation | null>(
		null,
	);
	const [operationToDelete, setOperationToDelete] =
		useState<DebtOperation | null>(null);
	const [isDeletingOperation, setIsDeletingOperation] = useState(false);
	const operationsRef = useRef<HTMLUListElement>(null);
	const operations = debt.operations ?? [];
	const remaining = Math.max(0, debt.targetAmount - debt.savedAmount);
	const animatedSaved = useAnimatedNumber(debt.savedAmount);
	const progress =
		debt.targetAmount > 0 ? (debt.savedAmount / debt.targetAmount) * 100 : 0;
	const clamped = Math.min(100, Math.max(0, progress));

	useEffect(() => {
		if (operationsRef.current) {
			autoAnimate(operationsRef.current, {
				duration: 200,
				easing: 'ease-in-out',
			});
		}
	}, []);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await api.delete(`/api/debts/${debt.id}`);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ['debts'] }),
				queryClient.invalidateQueries({ queryKey: ['accounts'] }),
				queryClient.invalidateQueries({ queryKey: ['balance'] }),
			]);
			setIsConfirmDeleteOpen(false);
			toast.success('Долг удалён', toastOptions);
			onClose();
		} catch (err) {
			console.error('Ошибка удаления долга', err);
			toast.error('Не удалось удалить долг', toastOptions);
		}
		setIsDeleting(false);
	};

	const handleDeleteOperation = async () => {
		if (!operationToDelete) return;

		setIsDeletingOperation(true);
		try {
			await api.delete(
				`/api/debts/${debt.id}/operations/${operationToDelete.id}`,
			);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ['debts'] }),
				queryClient.invalidateQueries({ queryKey: ['accounts'] }),
				queryClient.invalidateQueries({ queryKey: ['balance'] }),
			]);
			setOperationToDelete(null);
			toast.success('Транзакция удалена', toastOptions);
		} catch (err: unknown) {
			console.error('Ошибка удаления транзакции долга', err);
			let message = 'Не удалось удалить транзакцию';

			if (axios.isAxiosError(err)) {
				message = err.response?.data?.message || err.message || message;
			}

			toast.error(message, toastOptions);
		}
		setIsDeletingOperation(false);
	};

	return (
		<>
			<div className='flex h-full flex-col'>
				<h2 className='mb-5 font-bold text-[17px] text-[var(--foreground-primary)]'>
					Детали долга
				</h2>

				<div className='flex flex-1 flex-col gap-5 overflow-y-auto'>
					<div className='flex w-full flex-col items-center gap-3'>
						<div className='flex flex-col items-center gap-0.5'>
							<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
								{typeLabel[debt.type]}
							</span>
							<span className='text-center font-semibold text-[17px] text-[var(--foreground-primary)]'>
								{debt.name}
							</span>
						</div>

						<span className='text-center font-semibold text-[20px] text-[var(--foreground-primary)] tabular-nums'>
							{formatAmount(animatedSaved)}
							<span className='font-medium text-[var(--foreground-secondary)]'>
								{' '}
								/ {formatAmount(debt.targetAmount)} {currency}
							</span>
						</span>

						<div className='h-1 w-full overflow-hidden rounded-full bg-[var(--border-primary-hover)]'>
							<div
								className='h-full rounded-full bg-[var(--foreground-primary)] transition-[width] duration-500 ease-out'
								style={{ width: `${clamped}%` }}
							/>
						</div>

						<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
							Срок:{' '}
							{format(new Date(debt.deadline), 'd MMMM yyyy', { locale: ru })}
						</span>

						{debt.accountName && (
							<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
								Счёт: {debt.accountName}
							</span>
						)}
					</div>

					<Button
						type='button'
						disabled={remaining <= 0 || !debt.accountId}
						onClick={() => setIsOperationOpen(true)}
					>
						{actionLabel[debt.type]}
					</Button>

					<div className='flex flex-col gap-2.5'>
						<h3 className='font-medium text-[15px] text-[var(--foreground-primary)]'>
							История
						</h3>

						<ul ref={operationsRef} className='flex flex-col gap-2'>
							{operations.length === 0 ? (
								<li className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
									Транзакций пока нет
								</li>
							) : (
								operations.map(operation => (
									<li
										key={operation.id}
										className='flex items-center justify-between gap-3 rounded-[12px] bg-[var(--button-tertiary)] px-3.5 py-3'
									>
										<div className='flex min-w-0 flex-col gap-0.5'>
											<span className='font-medium text-[15px] text-[var(--foreground-primary)]'>
												+ {formatAmount(operation.amount)} {currency}
											</span>
											<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
												{format(new Date(operation.date), 'd MMMM yyyy, HH:mm', {
													locale: ru,
												})}
											</span>
										</div>

										<div className='flex shrink-0 items-center gap-3'>
											<EditButton
												onClick={() => setOperationToEdit(operation)}
											/>
											<DeleteButton
												onClick={() => setOperationToDelete(operation)}
											/>
										</div>
									</li>
								))
							)}
						</ul>
					</div>
				</div>

				<div className='mt-5 flex flex-row items-center gap-2.5'>
					<Button
						className='w-full'
						type='button'
						onClick={() => setIsEditOpen(true)}
					>
						Изменить
					</Button>
					<Button
						className='w-full'
						type='button'
						variant='wrong'
						onClick={() => setIsConfirmDeleteOpen(true)}
					>
						Удалить
					</Button>
				</div>
			</div>

			<DebtOperationModal
				isOpen={isOperationOpen}
				onClose={() => setIsOperationOpen(false)}
				currency={currency}
				debt={{
					id: debt.id,
					name: debt.name,
					type: debt.type,
					savedAmount: debt.savedAmount,
					targetAmount: debt.targetAmount,
				}}
			/>

			{operationToEdit && (
				<DebtOperationModal
					isOpen
					onClose={() => setOperationToEdit(null)}
					currency={currency}
					operation={operationToEdit}
					debt={{
						id: debt.id,
						name: debt.name,
						type: debt.type,
						savedAmount: debt.savedAmount,
						targetAmount: debt.targetAmount,
					}}
				/>
			)}

			<EditDebtModal
				isOpen={isEditOpen}
				onClose={() => setIsEditOpen(false)}
				debt={debt}
				currency={currency}
			/>

			<ConfirmDeleteOperationDialog
				isOpen={operationToDelete !== null}
				onClose={() => setOperationToDelete(null)}
				onConfirm={handleDeleteOperation}
				loading={isDeletingOperation}
			/>

			<ConfirmDeleteDialog
				isOpen={isConfirmDeleteOpen}
				onClose={() => setIsConfirmDeleteOpen(false)}
				onConfirm={handleDelete}
				debtName={debt.name}
				loading={isDeleting}
			/>
		</>
	);
};
