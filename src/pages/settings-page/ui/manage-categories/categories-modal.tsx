import React from 'react';
import { useMediaQuery } from '@/src/shared/hooks';
import { Drawer, Sheet } from '@/src/shared/ui';
import { CategoriesModalContent } from './categories-modal-content';

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export const CategoriesModal: React.FC<Props> = ({ isOpen, onClose }) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<>
			{isDesktop ? (
				<Sheet isOpen={isOpen} onClose={onClose}>
					{isOpen && <CategoriesModalContent />}
				</Sheet>
			) : (
				<Drawer isOpen={isOpen} onClose={onClose}>
					{isOpen && <CategoriesModalContent />}
				</Drawer>
			)}
		</>
	);
};
