import React from 'react';

import { Plus } from 'lucide-react';

export const CreateAccountButton: React.FC = () => {
	return (
		<button className='flex items-center justify-center w-full h-full rounded-[8px] bg-[var(--button-tertiary)] text-[var(--foreground-secondary)] hover:bg-[var(--button-tertiary-hover)] hover:text-[var(--foreground-primary)] active:scale-99 transition cursor-pointer'>
			<Plus strokeWidth={1.5} />
		</button>
	);
};
