import React, { useState } from 'react';

import { TransactionDetailsModal } from '@/src/widgets/transaction-details-modal';

interface Props {
	transfer: {
		id: string;
		date: string;
		type: string;
		accountFrom: {
			name: string;
			currency: {
				id: string;
				code: string;
				symbol: string | null;
			};
		};
		accountTo: {
			name: string;
			currency: {
				id: string;
				code: string;
				symbol: string | null;
			};
		};
		amountFrom: number;
		amountTo: number;
	};
}

export const TransferItem: React.FC<Props> = ({ transfer }) => {
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
				className='flex flex-row items-center justify-between gap-1 p-2.5 rounded-[8px] hover:bg-[var(--muted)] active:bg-[var(--muted)] transition cursor-pointer'
				onClick={openTransactionDetailsModal}
			>
				<div className='flex flex-row items-center gap-2.5'>
					<div className='flex items-center justify-center size-10 border-[0.5px] border-[var(--border-primary)] bg-[var(--card)] rounded-[6px] flex-shrink-0'>
						🔄
					</div>

					<div className='flex flex-col items-start gap-0.5'>
						<div className='font-medium text-[15px] text-[var(--foreground-primary)]'>
							Перевод между своими счетами
						</div>
						<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
							{transfer.accountFrom.name} → {transfer.accountTo.name}
						</span>
					</div>
				</div>

				<span className='font-medium text-[15px] text-[var(--foreground-primary)] flex-shrink-0'>
					{transfer.amountFrom}{' '}
					{transfer.accountFrom.currency.symbol ||
						transfer.accountFrom.currency.code}{' '}
					→ {transfer.amountTo}{' '}
					{transfer.accountTo.currency.symbol ||
						transfer.accountTo.currency.code}
				</span>
			</li>

			<TransactionDetailsModal
				isOpen={isTransactionDetailsModalOpen}
				onClose={closeTransactionDetailsModal}
				transaction={transfer}
			/>
		</>
	);
};
