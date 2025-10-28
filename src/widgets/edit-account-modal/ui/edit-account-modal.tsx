import React from 'react';

import { useMediaQuery } from '@/src/shared/hooks';

import { Drawer, Sheet } from '@/src/shared/ui';
import { EditAccountModalContent } from './edit-account-modal-content';

import { Account } from '../model/types';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	account: Account;
}

export const EditAccountModal: React.FC<Props> = ({
	isOpen,
	onClose,
	account,
}) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<>
			{isDesktop ? (
				<Sheet isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<EditAccountModalContent onClose={onClose} account={account} />
					)}
				</Sheet>
			) : (
				<Drawer isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<EditAccountModalContent onClose={onClose} account={account} />
					)}
				</Drawer>
			)}
		</>
	);
};
