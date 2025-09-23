import React from 'react';

import { SquarePen } from 'lucide-react';

interface Props {
	onClick?: () => void;
}

export const EditButton: React.FC<Props> = ({ onClick }) => {
	return (
		<button
			className='text-[var(--foreground-secondary)] hover:text-[var(--foreground-primary)] transition cursor-pointer'
			onClick={onClick}
			type='button'
		>
			<SquarePen size={16} strokeWidth={1.5} />
		</button>
	);
};
