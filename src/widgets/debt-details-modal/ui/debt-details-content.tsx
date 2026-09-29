'use client';

import React, { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Debt, DebtType } from '@/src/entities/debt';
import { Button, DeleteButton, EditButton } from '@/src/shared/ui';

interface Props {
	debt: Debt;
	currency: string;
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

export const DebtDetailsContent: React.FC<Props> = ({ debt, currency }) => {
	const operationsRef = useRef<HTMLUListElement>(null);
	const operations = debt.operations ?? [];
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

	return (
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

					<span className='text-center font-semibold text-[20px] text-[var(--foreground-primary)]'>
						{formatAmount(debt.savedAmount)}
						<span className='font-medium text-[var(--foreground-secondary)]'>
							{' '}
							/ {formatAmount(debt.targetAmount)} {currency}
						</span>
					</span>

					<div className='h-1 w-full overflow-hidden rounded-full bg-[var(--border-primary-hover)]'>
						<div
							className='h-full rounded-full bg-[var(--foreground-primary)]'
							style={{ width: `${clamped}%` }}
						/>
					</div>

					<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
						Срок:{' '}
						{format(new Date(debt.deadline), 'd MMMM yyyy', { locale: ru })}
					</span>
				</div>

				<Button type='button'>{actionLabel[debt.type]}</Button>

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
										<EditButton />
										<DeleteButton />
									</div>
								</li>
							))
						)}
					</ul>
				</div>
			</div>

			<div className='mt-5 flex flex-row items-center gap-2.5'>
				<Button className='w-full' type='button'>
					Изменить
				</Button>
				<Button className='w-full' type='button' variant='wrong'>
					Удалить
				</Button>
			</div>
		</div>
	);
};
