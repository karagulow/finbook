import React from 'react';

import { StickyHeader } from '@/src/shared/ui';
import { LinkItem } from './link-item';
import { Cog, Goal, HandCoins } from 'lucide-react';

interface Props {
	className?: string;
}

export const MorePage: React.FC<Props> = ({ className }) => {
	const STROKE_WIDTH = 1;

	return (
		<>
			<StickyHeader title='Ещё' />

			<div className='flex flex-col gap-5 sm:gap-[30px]'>
				<h1 className='font-medium text-[24px] text-[var(--foreground-primary)]'>
					Ещё
				</h1>

				<div className='flex flex-col gap-2.5'>
					<LinkItem
						title='Цели'
						description='Планируй, копи, достигай'
						path='/goals'
						icon={<Goal strokeWidth={STROKE_WIDTH} />}
					/>
					<LinkItem
						title='Долги'
						description='Учитывай, плати, освобождайся'
						path='/debts'
						icon={<HandCoins strokeWidth={STROKE_WIDTH} />}
					/>
					<LinkItem
						title='Настройки'
						description='Меняй, настраивай, управляй'
						path='/settings'
						icon={<Cog strokeWidth={STROKE_WIDTH} />}
					/>
				</div>
			</div>
		</>
	);
};
