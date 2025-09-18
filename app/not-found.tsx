import Link from 'next/link';

import { Button } from '@/src/shared/ui';

export default function NotFound() {
	return (
		<div className='w-full h-screen flex flex-col gap-7.5 justify-center items-center'>
			<div className='flex flex-col gap-2.5 items-center font-medium text-[var(--foreground-primary)]'>
				<h1 className='text-[30px]'>404</h1>
				<p className='text-[14px]'>Страница не найдена.</p>
			</div>
			<Link href='/'>
				<Button>Вернуться на главную</Button>
			</Link>
		</div>
	);
}
