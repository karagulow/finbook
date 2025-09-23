import React from 'react';

import { DeleteButton, EditButton } from '@/src/shared/ui';

import { Account } from '../model/types';

interface Props {
	account: Account;
}

export const AccountItem: React.FC<Props> = ({ account }) => {
	return (
		<li className='flex flex-row justify-between items-center gap-2 bg-[var(--muted)] rounded-[8px] py-2 px-3.5'>
			<div className='flex flex-col gap-0.5'>
				<span className='font-medium text-[15px] text-[var(--foreground-primary)]'>
					{account.name}
				</span>
				<span className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
					{account.balance.toLocaleString('ru-RU', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}{' '}
					{account.currency}
				</span>
			</div>

			<div className='flex flex-row items-center gap-2.5'>
				<EditButton />
				<DeleteButton />
			</div>
		</li>
	);
};
