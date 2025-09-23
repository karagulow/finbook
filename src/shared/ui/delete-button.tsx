import React from 'react';

import { Trash } from 'lucide-react';

interface Props {
	onClick?: () => void;
}

export const DeleteButton: React.FC<Props> = ({ onClick }) => {
	return (
		<button
			className='text-[var(--foreground-secondary)] hover:text-[var(--wrong)] transition cursor-pointer'
			onClick={onClick}
			type='button'
		>
			<Trash size={16} strokeWidth={1.5} />
		</button>
	);
};
