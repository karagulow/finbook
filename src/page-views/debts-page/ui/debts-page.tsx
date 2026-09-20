import React from 'react';
import Link from 'next/link';
import { Button } from '@/src/shared/ui';

export const DebtsPage: React.FC = () => {
	return (
		<div className='flex flex-col gap-5 sm:gap-[30px]'>
			<h1 className='font-medium text-[24px] text-[var(--foreground-primary)]'>
				Страница в разработке...
			</h1>

			<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
				Страница, которую вы ищете, пока находится в разработке.
				<br />
				Мы уделяем внимание каждой детали, чтобы всё работало идеально.
			</p>

			<p className='font-medium text-[13px] text-[var(--foreground-secondary)]'>
				Спасибо за ваше терпение.
				<br />
				Скоро всё будет готово.
			</p>

			<Link href='/home'>
				<Button>Перейти на главную</Button>
			</Link>
		</div>
	);
};
