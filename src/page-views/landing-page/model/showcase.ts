export const SHOWCASE_ITEMS = [
	{
		id: 'accounts',
		title: 'Все счета рядом.',
		text: 'Наличные, карты и накопления в одном списке. У каждого счёта своя валюта, а общий баланс виден сразу.',
		panelClassName:
			'bg-linear-to-b from-[#748068] to-[#8b907c] dark:from-[#32382c] dark:to-[#2c3228]',
		image: '/images/home-iphone-accounts.png',
	},
	{
		id: 'transactions',
		title: 'Операция за секунды.',
		text: 'Доход, расход или перевод между счетами. Категории и подкатегории показывают, на что уходят деньги.',
		panelClassName:
			'bg-linear-to-b from-[#637c86] to-[#778599] dark:from-[#243a42] dark:to-[#232f40]',
		image: '/images/home-iphone-transactions.png',
	},
	{
		id: 'analytics',
		title: 'Динамика по месяцам.',
		text: 'График доходов и расходов и разбивка по категориям — видно, как меняется баланс.',
		panelClassName:
			'bg-linear-to-b from-[#96745c] to-[#b08c74] dark:from-[#3c3028] dark:to-[#342c26]',
		image: '/images/home-iphone-analytics.png',
	},
] as const;
