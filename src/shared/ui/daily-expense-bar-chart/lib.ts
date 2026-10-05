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

export const niceScale = (value: number) => {
	if (value <= 0) return { max: 1000, step: 200 };

	const roughStep = value / 7;
	const magnitude = 10 ** Math.floor(Math.log10(roughStep));
	const residual = roughStep / magnitude;
	const niceFactor =
		residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10;
	const step = niceFactor * magnitude;

	return { max: Math.ceil(value / step) * step, step };
};

export const chartColors = (isLight: boolean) => {
	const fallback = isLight
		? { tick: '#6f6f6f', grid: '#dddddd', bar: '#ff4d4f' }
		: { tick: '#969799', grid: '#2c2e33', bar: '#ff8583' };

	if (typeof document === 'undefined') return fallback;

	const styles = getComputedStyle(document.documentElement);
	const tick = styles.getPropertyValue('--foreground-secondary').trim();
	const grid = styles.getPropertyValue('--border-primary').trim();
	const bar = styles.getPropertyValue('--wrong').trim();

	return {
		tick: tick || fallback.tick,
		grid: grid || fallback.grid,
		bar: bar || fallback.bar,
	};
};
