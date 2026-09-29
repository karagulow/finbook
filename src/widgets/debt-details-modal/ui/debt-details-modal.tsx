import React from 'react';

import { Debt } from '@/src/entities/debt';
import { useMediaQuery } from '@/src/shared/hooks';
import { Drawer, Sheet } from '@/src/shared/ui';
import { DebtDetailsContent } from './debt-details-content';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	debt: Debt | null;
	currency: string;
}

export const DebtDetailsModal: React.FC<Props> = ({
	isOpen,
	onClose,
	debt,
	currency,
}) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	if (!debt) return null;

	const content = <DebtDetailsContent debt={debt} currency={currency} />;

	return (
		<>
			{isDesktop ? (
				<Sheet isOpen={isOpen} onClose={onClose}>
					{isOpen && content}
				</Sheet>
			) : (
				<Drawer isOpen={isOpen} onClose={onClose}>
					{isOpen && content}
				</Drawer>
			)}
		</>
	);
};
