import React from 'react';

import { useMediaQuery } from '@/src/shared/hooks';

import { Drawer, Sheet } from '@/src/shared/ui';
import { AccountsModalContent } from './accounts-modal-content';
import { Account } from '../model/types';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	accounts: Account[];
	onCreateAccount?: () => void;
}

export const AccountsModal: React.FC<Props> = ({
	isOpen,
	onClose,
	accounts,
	onCreateAccount,
}) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<>
			{isDesktop ? (
				<Sheet isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<AccountsModalContent
							accounts={accounts}
							onCreateAccount={onCreateAccount}
						/>
					)}
				</Sheet>
			) : (
				<Drawer isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<AccountsModalContent
							accounts={accounts}
							onCreateAccount={onCreateAccount}
						/>
					)}
				</Drawer>
			)}
		</>
	);
};
