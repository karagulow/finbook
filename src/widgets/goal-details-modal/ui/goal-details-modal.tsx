import React from 'react';

import { useMediaQuery } from '@/src/shared/hooks';
import { Drawer, Sheet } from '@/src/shared/ui';
import { GoalDetails } from '../model/types';
import { GoalDetailsContent } from './goal-details-content';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	goal: GoalDetails | null;
	currency: string;
}

export const GoalDetailsModal: React.FC<Props> = ({
	isOpen,
	onClose,
	goal,
	currency,
}) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	if (!goal) return null;

	const content = (
		<GoalDetailsContent goal={goal} currency={currency} onClose={onClose} />
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
