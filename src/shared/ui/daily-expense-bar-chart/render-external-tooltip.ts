import type { Chart, TooltipModel } from 'chart.js';
import { hideChartTooltip, placeChartTooltip } from '../chart-tooltip-motion';
import { formatAmount } from './lib';
import type { DailyExpenseTooltipDetails } from './types';

const VISIBLE_CATEGORIES = 4;

const MONTHS_GENITIVE = [
	'января',
	'февраля',
	'марта',
	'апреля',
	'мая',
	'июня',
	'июля',
	'августа',
	'сентября',
	'октября',
	'ноября',
	'декабря',
];

export const renderExternalTooltip = (
	el: HTMLDivElement,
	context: { chart: Chart; tooltip: TooltipModel<'bar'> },
	details: DailyExpenseTooltipDetails,
) => {
	const { tooltip, chart } = context;

	if (tooltip.opacity === 0 || !tooltip.dataPoints.length) {
		hideChartTooltip(el);
		return;
	}

	const point = details.dataPoints[tooltip.dataPoints[0].dataIndex];
	if (!point) {
		hideChartTooltip(el);
		return;
	}

	el.replaceChildren();

	const title = document.createElement('div');
	title.className = 'font-medium text-[13px]';
	title.textContent = `${point.label} ${MONTHS_GENITIVE[details.month]} ${details.year}`;
	el.append(title);

	const expense = document.createElement('div');
	expense.className = 'mt-1.5 text-[var(--wrong)]';
	expense.textContent =
		point.expense <= 0
			? 'Расходов не было'
			: `Расходы: ${formatAmount(point.expense, details.currency)}`;
	el.append(expense);

	if (point.expense > 0) {
		const share =
			details.monthExpense > 0
				? Math.round((point.expense / details.monthExpense) * 100)
				: 0;
		const shareLine = document.createElement('div');
		shareLine.className = 'mt-0.5 text-[var(--foreground-secondary)]';
		shareLine.textContent = `${share}% от расходов за месяц`;
		el.append(shareLine);

		const categories = point.categories ?? [];
		if (categories.length > 0) {
			const list = document.createElement('div');
			list.className =
				'mt-2 flex flex-col gap-0.5 border-t border-[var(--border-primary)] pt-2';

			const visible = categories.slice(0, VISIBLE_CATEGORIES);
			for (const category of visible) {
				const row = document.createElement('div');
				row.textContent = `${category.name}: ${formatAmount(category.amount, details.currency)}`;
				list.append(row);
			}

			const hidden = categories.slice(VISIBLE_CATEGORIES);
			if (hidden.length > 0) {
				const hiddenAmount = hidden.reduce(
					(sum, category) => sum + category.amount,
					0,
				);
				const row = document.createElement('div');
				row.className = 'text-[var(--foreground-secondary)]';
				row.textContent = `Ещё ${hidden.length}: ${formatAmount(hiddenAmount, details.currency)}`;
				list.append(row);
			}

			el.append(list);
		}
	}

	const canvas = chart.canvas;
	const openToLeft = tooltip.caretX > canvas.clientWidth * 0.62;
	const x = openToLeft
		? tooltip.caretX - el.offsetWidth - 14
		: tooltip.caretX + 14;

	placeChartTooltip(el, x, tooltip.caretY);
};
