import React, { useCallback, useMemo, useState } from 'react';

import { useAccountSlider } from '../hooks/use-account-slider';

import { CreateAccountButton } from './actions/create-account-button';
import { ViewAllAccountsButton } from './actions/view-all-accounts-button';
import { ArrowButton } from './actions/arrow-button';
import { AccountCard } from './account-card';
import { SliderDots } from './slider-dots';
import { AccountCardSkeleton } from './account-card-skeleton';
import { AccountsModal } from '../../accounts-modal';
import { CreateAccountModal } from '../../create-account-modal';

import { useAccounts } from '../hooks/use-accounts';

export const AccountOverview: React.FC = () => {
	const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);
	const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
		useState(false);
	const { accounts, totalBalance, currencyCode, currencySymbol, loading } =
		useAccounts();

	const extendedAccounts = useMemo(
		() => [
			{
				id: 'all',
				name: 'Все счета',
				balance: totalBalance,
				currency: currencySymbol || currencyCode,
			},
			...accounts,
		],
		[accounts, totalBalance, currencyCode, currencySymbol]
	);
	const {
		currentIndex,
		totalItems,
		itemsPerView,
		canGoNext,
		canGoPrev,
		next,
		prev,
		goTo,
	} = useAccountSlider(extendedAccounts);

	const openAccountsSheet = useCallback(() => setIsAccountsModalOpen(true), []);
	const closeAccountsSheet = useCallback(
		() => setIsAccountsModalOpen(false),
		[]
	);

	const openCreateAccountModal = useCallback(
		() => setIsCreateAccountModalOpen(true),
		[]
	);
	const closeCreateAccountModal = useCallback(
		() => setIsCreateAccountModalOpen(false),
		[]
	);

	return (
		<>
			<div className='flex flex-row gap-2.5 w-full'>
				<div className='flex flex-col flex-1 min-w-0 gap-3'>
					<div className='relative overflow-hidden w-full'>
						{loading ? (
							<AccountCardSkeleton />
						) : (
							<div
								className='flex gap-2.5 transition-transform duration-300 ease-in-out'
								style={{
									transform: `translateX(-${
										(currentIndex * 100) / itemsPerView
									}%)`,
								}}
							>
								{extendedAccounts.map((account, idx) => (
									<AccountCard
										key={account.id}
										currentIndex={currentIndex}
										itemsPerView={itemsPerView}
										totalItems={totalItems}
										idx={idx}
										account={account}
									/>
								))}
							</div>
						)}
					</div>

					{totalItems > itemsPerView && (
						<SliderDots
							totalItems={totalItems}
							itemsPerView={itemsPerView}
							currentIndex={currentIndex}
							goTo={goTo}
						/>
					)}
				</div>

				<div className='grid grid-cols-2 gap-1.5 size-[100px] flex-shrink-0'>
					<CreateAccountButton onClick={openCreateAccountModal} />
					<ViewAllAccountsButton onClick={openAccountsSheet} />
					<ArrowButton direction='left' disabled={!canGoPrev} onClick={prev} />
					<ArrowButton direction='right' disabled={!canGoNext} onClick={next} />
				</div>
			</div>

			<AccountsModal
				isOpen={isAccountsModalOpen}
				onClose={closeAccountsSheet}
				accounts={accounts}
				onCreateAccount={() => {
					closeAccountsSheet();
					openCreateAccountModal();
				}}
			/>

			<CreateAccountModal
				isOpen={isCreateAccountModalOpen}
				onClose={closeCreateAccountModal}
			/>
		</>
	);
};
