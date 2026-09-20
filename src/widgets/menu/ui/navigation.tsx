import React from 'react';

import { ChartPie, Cog, LayoutGrid, ReceiptText } from 'lucide-react';

import { NavItem } from './nav-item';

const ICON_SIZE = 16;
const ICON_STROKE_WIDTH = 1.5;

export const Navigation: React.FC = () => {
	return (
		<nav className='flex flex-col w-full gap-2'>
			<NavItem
				path='/home'
				icon={<LayoutGrid size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Главная'
			/>
			<NavItem
				path='/transactions'
				icon={<ReceiptText size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Транзакции'
			/>
			<NavItem
				path='/analytics'
				icon={<ChartPie size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Аналитика'
			/>
			{/* <NavItem
				path='/goals'
				icon={<Goal size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Цели'
			/> */}
			{/* <NavItem
				path='/debts'
				icon={<HandCoins size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Долги'
			/> */}
			<NavItem
				path='/settings'
				icon={<Cog size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Настройки'
			/>
		</nav>
	);
};
