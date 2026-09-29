import React from 'react';

import { DebtType } from '@/src/entities/debt';
import { useMediaQuery } from '@/src/shared/hooks';
import { Drawer, Sheet } from '@/src/shared/ui';
import { AddDebtModalContent } from './add-debt-modal-content';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	currency: string;
	initialType: DebtType;
}

export const AddDebtModal: React.FC<Props> = ({
	isOpen,
	onClose,
	currency,
	initialType,
}) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<>
			{isDesktop ? (
				<Sheet isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<AddDebtModalContent
							onClose={onClose}
							currency={currency}
							initialType={initialType}
						/>
					)}
				</Sheet>
			) : (
				<Drawer isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<AddDebtModalContent
							onClose={onClose}
							currency={currency}
							initialType={initialType}
						/>
					)}
				</Drawer>
			)}
		</>
	);
};
