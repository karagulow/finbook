import React from 'react';

import { TabbarItem } from './tabbar-item';
import { AlignJustify, ChartPie, LayoutGrid, ReceiptText } from 'lucide-react';

const ICON_SIZE = 20;
const ICON_STROKE_WIDTH = 1.5;

export const Tabbar: React.FC = () => {
	return (
		<nav className='fixed left-5 bottom-5 flex lg:hidden flex-row items-center w-[calc(100%-40px)] bg-[var(--background-primary)]/70 backdrop-blur-md border-[0.5px] border-[var(--border-primary)] rounded-full z-10 h-15'>
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
