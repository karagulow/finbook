'use client';

import React, { useState } from 'react';

import { Button } from '@/src/shared/ui';
import { SettingsBlockItem } from '../settings-block-layout';
import { ExportDataModal } from './export-data-modal';

export const ExportData: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<SettingsBlockItem>
				<div className='flex flex-col gap-1.5'>
					<span className='text-[15px] text-[var(--foreground-primary)]'>
						Выгрузка
					</span>
					<span>Скачать данные аккаунта в файл Excel.</span>
				</div>
				<Button className='w-full sm:w-fit' onClick={() => setIsModalOpen(true)}>
					Скачать
				</Button>
			</SettingsBlockItem>

			<ExportDataModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
};
