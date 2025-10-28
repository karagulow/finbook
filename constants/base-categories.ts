export const baseCategories = {
	INCOME: [
		{
			name: 'Зарплата',
			icon: '💼',
			color: '#81c784', // мягкий зеленый
			subcategories: ['Основная', 'Премии'],
			order: 0,
		},
		{
			name: 'Инвестиции',
			icon: '📈',
			color: '#4db6ac', // спокойный бирюзовый
			subcategories: ['Дивиденды', 'Купоны', 'Вклады'],
			order: 1,
		},
		{
			name: 'Прочие доходы',
			icon: '💸',
			color: '#aed581', // светло-зеленый
			subcategories: ['Подарки', 'Продажа вещей'],
			order: 2,
		},
	],
	EXPENSE: [
		{
			name: 'Жилье',
			icon: '🏠',
			color: '#ffb74d', // мягкий оранжевый
			subcategories: ['Аренда', 'Коммунальные услуги', 'Ремонт и обслуживание'],
			order: 0,
		},
		{
			name: 'Транспорт',
			icon: '🚌',
			color: '#64b5f6', // мягкий синий
			subcategories: ['Общественный', 'Личный автомобиль', 'Такси'],
			order: 1,
		},
		{
			name: 'Еда',
			icon: '🍔',
			color: '#e57373', // мягкий красный
			subcategories: ['Продукты', 'Кафе/рестораны'],
			order: 2,
		},
		{
			name: 'Здоровье и красота',
			icon: '⚕️',
			color: '#ba68c8', // мягкий фиолетовый
			subcategories: [],
			order: 3,
		},
		{
			name: 'Личные траты',
			icon: '🛍️',
			color: '#f06292', // нежный розовый
			subcategories: ['Одежда', 'Хобби'],
			order: 4,
		},
		{
			name: 'Развлечения',
			icon: '🎬',
			color: '#9575cd', // светлый фиолетовый
			subcategories: ['Кино', 'Концерты'],
			order: 5,
		},
		{
			name: 'Подписки',
			icon: '📱',
			color: '#7986cb', // мягкий синий
			subcategories: [],
			order: 6,
		},
		{
			name: 'Путешествие',
			icon: '🛫',
			color: '#a1887f', // мягкий коричневый
			subcategories: [],
			order: 7,
		},
		{
			name: 'Прочие расходы',
			icon: '💸',
			color: '#90a4ae', // мягкий серо-голубой
			subcategories: ['Подарки', 'Благотворительность'],
			order: 8,
		},
	],
};
