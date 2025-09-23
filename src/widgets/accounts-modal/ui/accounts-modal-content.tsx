import React from 'react';

import { Button } from '@/src/shared/ui';
import { AccountList } from './account-list';

import { Account } from '../model/types';

interface Props {
	accounts: Account[];
}

export const AccountsModalContent: React.FC<Props> = ({ accounts }) => {
	return (
		<div className='flex h-full flex-col'>
			<h2 className='mb-5 font-bold text-[17px] text-[var(--foreground-primary)]'>
				Все счета
			</h2>

			<div className='flex-1 overflow-y-auto'>
				<AccountList accounts={accounts} />
			</div>

			<Button className='mt-5 shrink-0'>Создать счёт</Button>
		</div>
	);
};
