import React from 'react';

import { useMediaQuery } from '@/src/shared/hooks';
import { Drawer, Sheet } from '@/src/shared/ui';
import { EditCategoryContent } from './edit-category-content';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	category: any;
}

export const EditCategoryModal: React.FC<Props> = ({
	isOpen,
	onClose,
	category,
}) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<>
			{isDesktop ? (
				<Sheet isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<EditCategoryContent onClose={onClose} category={category} />
					)}
				</Sheet>
			) : (
				<Drawer isOpen={isOpen} onClose={onClose}>
					{isOpen && (
						<EditCategoryContent onClose={onClose} category={category} />
					)}
				</Drawer>
			)}
		</>
	);
};
