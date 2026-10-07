'use client';

import React from 'react';

import { Dialog } from '@/src/shared/ui';
import { PinCodeContent } from './pin-code-content';

type Mode = 'create' | 'change' | 'disable';

interface PinCodeModalProps {
	mode: Mode | null;
	onClose: () => void;
	onChanged: () => void;
}

export const PinCodeModal: React.FC<PinCodeModalProps> = ({
	mode,
	onClose,
	onChanged,
}) => {
	return (
		<Dialog
			isOpen={Boolean(mode)}
			onClose={onClose}
			className='max-w-[360px]'
		>
			{mode && (
				<PinCodeContent
					key={mode}
					mode={mode}
					onClose={onClose}
					onChanged={onChanged}
				/>
			)}
		</Dialog>
	);
};
