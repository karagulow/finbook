import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import autoAnimate from '@formkit/auto-animate';

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

	const [prevAccounts, setPrevAccounts] = useState(accounts);

	useEffect(() => {
		if (!loading) {
			setPrevAccounts(accounts);
		}
	}, [accounts, loading]);

	const extendedAccounts = useMemo(
		() => [
			{
				id: 'all',
				name: 'Все счета',
				balance: totalBalance,
				currency: currencySymbol || currencyCode,
			},
			...prevAccounts,
		],
		[prevAccounts, totalBalance, currencyCode, currencySymbol]
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

	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (containerRef.current) {
			autoAnimate(containerRef.current, {
				duration: 250,
				easing: 'ease-in-out',
			});
		}
	}, []);

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
						<div
							className='flex gap-2.5 transition-transform duration-300 ease-in-out'
							style={{
								transform: `translateX(-${
									(currentIndex * 100) / itemsPerView
								}%)`,
							}}
							ref={containerRef}
						>
							{loading && extendedAccounts.length <= 1 ? (
								<AccountCardSkeleton />
							) : (
								extendedAccounts.map((account, idx) => (
									<AccountCard
										key={account.id}
										account={account}
										idx={idx}
										currentIndex={currentIndex}
										itemsPerView={itemsPerView}
										totalItems={totalItems}
									/>
								))
							)}
						</div>
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
