import { Button } from '@/shared/ui';
import { Balance } from '@/entities/balance';

export default function Home() {
	return (
		<div className='flex flex-col gap-5 sm:gap-[30px]'>
			<div className='flex flex-col items-start gap-2.5 sm:flex-row sm:justify-between sm:items-center'>
				<Balance />
				<Button className='w-full sm:w-auto'>Добавить транзакцию</Button>
			</div>
		</div>
	);
}
