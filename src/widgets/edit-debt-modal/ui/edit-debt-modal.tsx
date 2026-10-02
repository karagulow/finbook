import React from 'react';

import { useMediaQuery } from '@/src/shared/hooks';
import { Drawer, Sheet } from '@/src/shared/ui';
import { EditableDebt } from '../model/types';
import { EditDebtModalContent } from './edit-debt-modal-content';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	debt: EditableDebt;
	currency: string;
}

export const EditDebtModal: React.FC<Props> = ({
	isOpen,
	onClose,
	debt,
	currency,
}) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<>
			{isDesktop ? (
				<Sheet isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<EditDebtModalContent
							onClose={onClose}
							debt={debt}
							currency={currency}
						/>
					)}
				</Sheet>
			) : (
				<Drawer isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<EditDebtModalContent
							onClose={onClose}
							debt={debt}
							currency={currency}
						/>
					)}
				</Drawer>
			)}
		</>
	);
};
