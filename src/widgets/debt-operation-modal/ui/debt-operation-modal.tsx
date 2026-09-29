import React from 'react';

import { useMediaQuery } from '@/src/shared/hooks';
import { Drawer, Sheet } from '@/src/shared/ui';
import { DebtOperationTarget } from '../model/types';
import { DebtOperationModalContent } from './debt-operation-modal-content';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	debt: DebtOperationTarget;
	currency: string;
}

export const DebtOperationModal: React.FC<Props> = ({
	isOpen,
	onClose,
	debt,
	currency,
}) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	const content = (
		<DebtOperationModalContent
			debt={debt}
			currency={currency}
			onClose={onClose}
		/>
	);

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
