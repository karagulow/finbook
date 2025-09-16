'use client';

import { Button, CategoryDoughnutChart } from '@/shared/ui';
import { Balance } from '@/entities/balance';

export const HomePage: React.FC = () => {
	const incomes = [
		{
			id: '1',
			name: 'Зарплата',
			amount: 105000,
			color: '#ff8583',
		},
		{
			id: '2',
			name: 'Инвестиции',
			amount: 12000,
			color: '#009688',
		},
		{
			id: '3',
			name: 'Прочие доходы',
			amount: 2000,
			color: '#8bc34a',
		},
	];

	const expenses = [
		{
			id: '2',
			name: 'Еда',
			amount: 16234,
			color: '#ff8583',
		},
		{
			id: '3',
			name: 'Транспорт',
			amount: 4500,
			color: '#2196f3',
		},
		{
			id: '4',
			name: 'Личные траты',
			amount: 6000,
			color: '#e91e63',
		},
		{
			id: '5',
			name: 'Здоровье',
			amount: 4000,
			color: '#9c27b0',
		},
		{
			id: '6',
			name: 'Прочие расходы',
			amount: 3500,
			color: '#607d8b',
		},
		{
			id: '7',
			name: 'Досуги',
			amount: 1000,
			color: '#f44336',
		},
		{
			id: '8',
			name: 'Культура',
			amount: 5000,
			color: '#673ab7',
		},
	];

	return (
		<div className='flex flex-col gap-5 sm:gap-[30px]'>
			<div className='flex flex-col items-start gap-2.5 sm:flex-row sm:justify-between sm:items-center'>
				<Balance />
				<Button className='w-full sm:w-auto'>Добавить транзакцию</Button>
			</div>

			<div className='flex flex-col gap-5 md:flex-row md:gap-7.5'>
				<CategoryDoughnutChart title='Доходы' categories={incomes} />
				<CategoryDoughnutChart title='Расходы' categories={expenses} />
			</div>
		</div>
	);
};
