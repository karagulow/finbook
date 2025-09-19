'use client';

import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

interface Props {
	children?: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

export const Sheet: React.FC<Props> = ({ children, isOpen, onClose }) => {
	const nodeRef = useRef<HTMLDivElement>(null);

	return (
		<CSSTransition
			in={isOpen}
			timeout={300}
			classNames='sheet'
			unmountOnExit
			nodeRef={nodeRef}
		>
			<div
				ref={nodeRef}
				className='sheet-backdrop fixed inset-0 flex justify-end p-5 z-10'
				onClick={onClose}
			>
				<div
					className='sheet-panel w-100 h-[calc(100vh-40px)] rounded-[8px] bg-[var(--card)] p-5 shadow-[0px_0px_10px_10px_rgba(0,0,0,0.25)]'
					onClick={e => e.stopPropagation()}
				>
					{children}
				</div>
			</div>
		</CSSTransition>
	);
};
