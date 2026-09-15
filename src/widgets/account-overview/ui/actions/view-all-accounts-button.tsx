import React, { memo } from 'react';

import { Settings2 } from 'lucide-react';

interface Props {
	onClick?: () => void;
}

const ViewAllAccountsButtonComponent: React.FC<Props> = ({ onClick }) => {
	return (
		<button
			className='flex items-center justify-center w-full h-full rounded-full bg-[var(--button-tertiary)] text-[var(--foreground-secondary)] hover:bg-[var(--button-tertiary-hover)] hover:text-[var(--foreground-primary)] active:scale-99 transition cursor-pointer'
			onClick={onClick}
			type='button'
		>
			<Settings2 strokeWidth={1.5} />{' '}
		</button>
	);
};

ViewAllAccountsButtonComponent.displayName = 'ViewAllAccountsButton';

export const ViewAllAccountsButton = memo(ViewAllAccountsButtonComponent);
