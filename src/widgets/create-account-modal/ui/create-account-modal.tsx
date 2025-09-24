import React from 'react';

import { useMediaQuery } from '@/src/shared/hooks';

import { Drawer, Sheet } from '@/src/shared/ui';
import { CreateAccountModalContent } from './create-account-modal-content';

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export const CreateAccountModal: React.FC<Props> = ({ isOpen, onClose }) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<>
			{isDesktop ? (
				<Sheet isOpen={isOpen} onClose={onClose}>
					{isOpen && <CreateAccountModalContent onClose={onClose} />}
				</Sheet>
			) : (
				<Drawer isOpen={isOpen} onClose={onClose}>
					{isOpen && <CreateAccountModalContent onClose={onClose} />}
				</Drawer>
			)}
		</>
	);
};
