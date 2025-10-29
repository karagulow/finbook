import React from 'react';

import { useMediaQuery } from '@/src/shared/hooks';
import { Drawer, Sheet } from '@/src/shared/ui';
import { ChangeCurrencyContent } from './change-currency-content';
import { Currency } from '../../model/types';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	currency: Currency;
}

export const ChangeCurrencyModal: React.FC<Props> = ({
	isOpen,
	onClose,
	currency,
}) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<>
			{isDesktop ? (
				<Sheet isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<ChangeCurrencyContent currency={currency} onClose={onClose} />
					)}
				</Sheet>
			) : (
				<Drawer isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<ChangeCurrencyContent currency={currency} onClose={onClose} />
					)}
				</Drawer>
			)}
		</>
	);
};
