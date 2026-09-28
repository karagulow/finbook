import React from 'react';

import { useMediaQuery } from '@/src/shared/hooks';
import { Drawer, Sheet } from '@/src/shared/ui';
import { EditableGoal } from '../model/types';
import { EditGoalModalContent } from './edit-goal-modal-content';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	goal: EditableGoal;
	currency: string;
}

export const EditGoalModal: React.FC<Props> = ({
	isOpen,
	onClose,
	goal,
	currency,
}) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<>
			{isDesktop ? (
				<Sheet isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<EditGoalModalContent
							onClose={onClose}
							goal={goal}
							currency={currency}
						/>
					)}
				</Sheet>
			) : (
				<Drawer isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<EditGoalModalContent
							onClose={onClose}
							goal={goal}
							currency={currency}
						/>
					)}
				</Drawer>
			)}
		</>
	);
};
