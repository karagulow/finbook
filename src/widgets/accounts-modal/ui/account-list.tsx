import React from 'react';

import { AccountItem } from './account-item';

import { Account } from '../model/types';

interface Props {
	accounts: Account[];
}

export const AccountList: React.FC<Props> = ({ accounts }) => {
	return (
		<ul className='flex flex-col gap-2.5'>
			{accounts.map(account => (
				<AccountItem key={account.id} account={account} />
			))}
		</ul>
	);
};
