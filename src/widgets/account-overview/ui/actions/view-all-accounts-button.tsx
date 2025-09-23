import React from 'react';

import { Settings2 } from 'lucide-react';

interface Props {
	onClick: () => void;
}

export const ViewAllAccountsButton: React.FC<Props> = ({ onClick }) => {
	return (
		<button
			className='flex items-center justify-center w-full h-full rounded-[8px] bg-[var(--button-tertiary)] text-[var(--foreground-secondary)] hover:bg-[var(--button-tertiary-hover)] hover:text-[var(--foreground-primary)] active:scale-99 transition cursor-pointer'
			onClick={onClick}
		>
			<Settings2 strokeWidth={1.5} />{' '}
		</button>
	);
};
