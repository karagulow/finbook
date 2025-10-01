import React, { useState } from 'react';

import { TransactionDetailsModal } from '@/src/widgets/transaction-details-modal';

interface Props {
	transaction: {
		id: string;
		type: string;
		amount: number;
		date: string;
		category: { name: string; icon: string };
		subcategory?: { name: string };
		account: {
			name: string;
			currency: { code: string; symbol: string | null };
		};
	};
}

export const TransactionItem: React.FC<Props> = ({ transaction }) => {
	const isIncome = transaction.type === 'INCOME';
	const sign = isIncome ? '+' : '-';

	const [isTransactionDetailsModalOpen, setIsTransactionDetailsModalOpen] =
		useState(false);

	const openTransactionDetailsModal = () => {
		setIsTransactionDetailsModalOpen(true);
	};
	const closeTransactionDetailsModal = () => {
		setIsTransactionDetailsModalOpen(false);
	};

	return (
		<>
			<li
				className='flex flex-row items-center justify-between p-2.5 rounded-[8px] hover:bg-[var(--muted)] active:bg-[var(--muted)] transition cursor-pointer'
				onClick={openTransactionDetailsModal}
			>
				<div className='flex flex-row items-center gap-2.5'>
					<div className='flex items-center justify-center size-10 border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] rounded-[6px] flex-shrink-0'>
						{transaction.category?.icon}
					</div>

					<div className='flex flex-col items-start gap-0.5'>
						<div className='font-medium text-[15px] text-[var(--foreground-primary)]'>
							{transaction.category?.name || 'Без категории'}
							{transaction.subcategory && (
								<span className='text-[var(--foreground-secondary)]'>
									: {transaction.subcategory.name}
								</span>
							)}
						</div>
						<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
							{transaction.account?.name || 'Без счёта'}
						</span>
					</div>
				</div>

				<span className='font-medium text-[15px] text-[var(--foreground-primary)] flex-shrink-0'>
					{sign}{' '}
					{transaction.amount?.toLocaleString('ru-RU', {
						minimumFractionDigits: 2,
					})}{' '}
					{transaction.account?.currency?.symbol ||
						transaction.account?.currency?.code}
				</span>
			</li>

			<TransactionDetailsModal
				isOpen={isTransactionDetailsModalOpen}
				onClose={closeTransactionDetailsModal}
				transaction={transaction}
			/>
		</>
	);
};
