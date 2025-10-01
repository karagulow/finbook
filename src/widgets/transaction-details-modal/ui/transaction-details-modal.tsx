import React from 'react';

import { useMediaQuery } from '@/src/shared/hooks';

import { Drawer, Sheet } from '@/src/shared/ui';
import { TransactionDetailsContent } from './transaction-details-content';
import { Transaction } from '../model/types';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	transaction: Transaction;
}

export const TransactionDetailsModal: React.FC<Props> = ({
	isOpen,
	onClose,
	transaction,
}) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<>
			{isDesktop ? (
				<Sheet isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<TransactionDetailsContent
							transaction={transaction}
							onCloseModal={onClose}
						/>
					)}
				</Sheet>
			) : (
				<Drawer isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<TransactionDetailsContent
							transaction={transaction}
							onCloseModal={onClose}
						/>
					)}
				</Drawer>
			)}
		</>
	);
};
