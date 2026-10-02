import React from 'react';

import { useMediaQuery } from '@/src/shared/hooks';
import { Drawer, Sheet } from '@/src/shared/ui';
import { CreateGoalModalContent } from './create-goal-modal-content';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	currency: string;
}

export const CreateGoalModal: React.FC<Props> = ({
	isOpen,
	onClose,
	currency,
}) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<>
			{isDesktop ? (
				<Sheet isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<CreateGoalModalContent onClose={onClose} currency={currency} />
					)}
				</Sheet>
			) : (
				<Drawer isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<CreateGoalModalContent onClose={onClose} currency={currency} />
					)}
				</Drawer>
			)}
		</>
	);
};
