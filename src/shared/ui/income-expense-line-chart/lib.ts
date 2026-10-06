const SHORT_MONTHS: Record<string, string> = {
	Январь: 'Янв',
	Февраль: 'Фев',
	Март: 'Мар',
	Апрель: 'Апр',
	Май: 'Май',
	Июнь: 'Июн',
	Июль: 'Июл',
	Август: 'Авг',
	Сентябрь: 'Сен',
	Октябрь: 'Окт',
	Ноябрь: 'Ноя',
	Декабрь: 'Дек',
};

export const shortMonth = (label: string) => SHORT_MONTHS[label] ?? label;

export const formatAmount = (
	value: number,
	currency: string,
	signed = false,
) => {
	const rounded = Math.round(value);
	const formatted = Math.abs(rounded).toLocaleString('ru-RU');
	const sign = signed ? (rounded > 0 ? '+' : rounded < 0 ? '-' : '') : '';

	return `${sign}${formatted} ${currency}`;
};

export const niceStep = (range: number) => {
	if (range <= 0) return 1000;

	const roughStep = range / 5;
	const magnitude = 10 ** Math.floor(Math.log10(roughStep));
	const residual = roughStep / magnitude;
	const niceFactor =
		residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10;

	return niceFactor * magnitude;
};

export const chartColors = (isLight: boolean) => {
	const fallback = isLight
		? {
				tick: '#6f6f6f',
				grid: '#dddddd',
				income: '#22c55e',
				expense: '#ff4d4f',
				accumulated: '#3b82f6',
			}
		: {
				tick: '#969799',
				grid: '#2c2e33',
				income: '#71c57f',
				expense: '#ff8583',
				accumulated: '#4a7ee0',
			};

	if (typeof document === 'undefined') return fallback;

	const styles = getComputedStyle(document.documentElement);
	const read = (name: string, fallbackValue: string) =>
		styles.getPropertyValue(name).trim() || fallbackValue;

	return {
		tick: read('--foreground-secondary', fallback.tick),
		grid: read('--border-primary', fallback.grid),
		income: read('--success', fallback.income),
		expense: read('--wrong', fallback.expense),
		accumulated: read('--accent', fallback.accumulated),
	};
};
