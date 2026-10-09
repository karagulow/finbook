'use client';

import React from 'react';

import { useMediaQuery } from '@/src/shared/hooks';
import { Drawer, Sheet } from '@/src/shared/ui';
import { ExportDataContent } from './export-data-content';

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export const ExportDataModal: React.FC<Props> = ({ isOpen, onClose }) => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<>
			{isDesktop ? (
				<Sheet isOpen={isOpen} onClose={onClose}>
					{isOpen && <ExportDataContent onClose={onClose} />}
				</Sheet>
			) : (
				<Drawer isOpen={isOpen} onClose={onClose}>
					{isOpen && <ExportDataContent onClose={onClose} />}
				</Drawer>
			)}
		</>
	);
};
