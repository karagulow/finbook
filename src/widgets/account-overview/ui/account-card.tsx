import React from 'react';

import { useSelectedAccount } from '../hooks/use-selected-account';

type Account = {
	id: string;
	name: string;
	balance: number;
	currency: string;
};

interface Props {
	currentIndex: number;
	itemsPerView: number;
	totalItems: number;
	idx: number;
	account: Account;
}

export const AccountCard: React.FC<Props> = ({
	currentIndex,
	itemsPerView,
	totalItems,
	idx,
	account,
}) => {
	const { selectedAccountId, setSelectedAccountId } = useSelectedAccount();

	const isLastVisible =
		idx === currentIndex + itemsPerView - 1 || idx === totalItems - 1;

	const isSelected = selectedAccountId === account.id;

	return (
		<div
			key={account.id}
			className='flex-shrink-0'
			style={{
				width: `calc(${100 / itemsPerView}% - ${
					!isLastVisible ? 0.625 : 0
				}rem)`,
			}}
		>
			<div
				onClick={() => setSelectedAccountId(account.id)}
				className={`flex flex-col items-start justify-between bg-[var(--card)] h-[100px] rounded-[8px] p-4 border-[0.5px] hover:border-[var(--border-primary)] transition cursor-pointer ${
					isSelected ? 'border-[var(--border-primary)]' : 'border-transparent'
				}`}
			>
				<div className='font-medium text-[15px] text-[var(--foreground-primary)]'>
					{account.name}
				</div>
				<div className='text-[21px] font-medium text-[var(--foreground-primary)]'>
					{account.balance.toLocaleString('ru-RU', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}{' '}
					<span className='text-[var(--foreground-secondary)]'>
						{account.currency}
					</span>
				</div>
			</div>
		</div>
	);
};
