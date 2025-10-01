import React from 'react';

import { Drawer, Sheet } from '@/src/shared/ui';
import { useMediaQuery } from '@/src/shared/hooks';
import { EditTransactionContent } from './edit-transaction-content';
import { Transaction } from '../model/types';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	transaction: Transaction;
}

export const EditTransactionModal: React.FC<Props> = ({
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
						<EditTransactionContent
							transaction={transaction}
							onClose={onClose}
						/>
					)}
				</Sheet>
			) : (
				<Drawer isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<EditTransactionContent
							transaction={transaction}
							onClose={onClose}
						/>
					)}
				</Drawer>
			)}
		</>
	);
};
