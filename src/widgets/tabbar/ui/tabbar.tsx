import React from 'react';

import { TabbarItem } from './tabbar-item';
import { AlignJustify, ChartPie, LayoutGrid, ReceiptText } from 'lucide-react';

const ICON_SIZE = 20;
const ICON_STROKE_WIDTH = 1.5;

export const Tabbar: React.FC = () => {
	return (
		<nav className='fixed left-0 bottom-[-1px] flex lg:hidden flex-row items-center w-full h-14 bg-[var(--background-primary)] border-t-[0.5px] border-[var(--border-primary)] z-10'>
			<TabbarItem
				path='/'
				icon={<LayoutGrid size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Главная'
			/>
			<TabbarItem
				path='/transactions'
				icon={<ReceiptText size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Транзакции'
			/>
			<TabbarItem
				path='/analytics'
				icon={<ChartPie size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Аналитика'
			/>
			<TabbarItem
				path='/more'
				icon={<AlignJustify size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
				label='Ещё'
			/>
		</nav>
	);
};
