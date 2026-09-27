import React from 'react';

import { useMediaQuery } from '@/src/shared/hooks';
import { Drawer, Sheet } from '@/src/shared/ui';
import { GoalOperationTarget, GoalOperationType } from '../model/types';
import { GoalOperationModalContent } from './goal-operation-modal-content';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	goal: GoalOperationTarget;
	type: GoalOperationType;
	currency: string;
}

export const GoalOperationModal: React.FC<Props> = ({
	isOpen,
	onClose,
	goal,
	type,
	currency,
}) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	const content = (
		<GoalOperationModalContent
			goal={goal}
			type={type}
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
