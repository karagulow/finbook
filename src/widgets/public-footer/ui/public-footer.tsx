import React from 'react';

export const PublicFooter: React.FC = () => {
	return (
		<footer className='relative flex justify-center px-4 py-8'>
			<div
				aria-hidden
				className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--border-primary)] to-transparent'
			/>
			<p className='font-medium text-[13px] text-[var(--foreground-secondary)] text-center'>
				© {new Date().getFullYear()} Финкнижка
			</p>
		</footer>
	);
};
