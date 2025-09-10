import React from 'react';

import { Navigation } from './navigation';
import { LogoutButton } from './logout-button';

export const Menu: React.FC = () => {
	return (
		<aside className='sticky top-5 hidden lg:flex flex-col justify-between items-start min-w-[250px] h-[calc(100vh-40px)] my-5 p-2.5 bg-[var(--card)] rounded-[8px]'>
			<div className='flex flex-col items-center gap-5 w-full'>
				<span className='p-2.5 font-semibold text-[24px] text-[var(--foreground-primary)]'>
					Финкнижка
				</span>

				<Navigation />
			</div>

			<LogoutButton />
		</aside>
	);
};
