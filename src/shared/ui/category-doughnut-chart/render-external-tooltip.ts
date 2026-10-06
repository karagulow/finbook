import type { Chart, TooltipModel } from 'chart.js';
import { hideChartTooltip, placeChartTooltip } from '../chart-tooltip-motion';
import { formatAmount } from './lib';
import type { CategoryDoughnutTooltipDetails } from './types';

type TooltipContent = {
	key: string;
};

const tooltipContent = new WeakMap<HTMLElement, TooltipContent>();

const shareScope = (title: string) => {
	if (/расход/i.test(title)) return 'от расходов';
	if (/доход/i.test(title)) return 'от доходов';
	return 'от суммы';
};

const amountClassName = (title: string) => {
	if (/расход/i.test(title)) return 'mt-1.5 text-[var(--wrong)]';
	if (/доход/i.test(title)) return 'mt-1.5 text-[var(--success)]';
	return 'mt-1.5';
};

export const renderExternalTooltip = (
	el: HTMLDivElement,
	context: { chart: Chart; tooltip: TooltipModel<'doughnut'> },
	details: CategoryDoughnutTooltipDetails,
) => {
	const { tooltip, chart } = context;
	const content = tooltipContent.get(el) ?? { key: '' };
	tooltipContent.set(el, content);

	if (tooltip.opacity === 0 || !tooltip.dataPoints.length) {
		hideChartTooltip(el);
		return;
	}

	const category = details.categories[tooltip.dataPoints[0].dataIndex];
	if (!category) {
		hideChartTooltip(el);
		return;
	}

	const share =
		details.total > 0 ? Math.round((category.amount / details.total) * 100) : 0;
	const rank = details.categories.findIndex(item => item.id === category.id) + 1;
	const rest = details.total - category.amount;

	if (content.key !== category.id) {
		el.replaceChildren();

		const title = document.createElement('div');
		title.className = 'font-medium text-[13px]';
		title.textContent = category.name;
		el.append(title);

		const amount = document.createElement('div');
		amount.className = amountClassName(details.title);
		amount.textContent = `${formatAmount(category.amount)} ₽`;
		el.append(amount);

		const shareLine = document.createElement('div');
		shareLine.className = 'mt-0.5 text-[var(--foreground-secondary)]';
		shareLine.textContent = `${share}% ${shareScope(details.title)}`;
		el.append(shareLine);

		if (details.categories.length > 1) {
			const rankLine = document.createElement('div');
			rankLine.className = 'mt-0.5 text-[var(--foreground-secondary)]';
			rankLine.textContent =
				rank === 1
					? 'Самая крупная'
					: `${rank}-я из ${details.categories.length}`;
			el.append(rankLine);

			const restBlock = document.createElement('div');
			restBlock.className = 'mt-2 border-t border-[var(--border-primary)] pt-2';
			restBlock.textContent = `Остальные: ${formatAmount(rest)} ₽`;
			el.append(restBlock);
		}

		content.key = category.id;
	}

	const canvas = chart.canvas;
	const openToLeft = tooltip.caretX > canvas.clientWidth * 0.62;
	const x = openToLeft
		? tooltip.caretX - el.offsetWidth - 14
		: tooltip.caretX + 14;

	placeChartTooltip(el, x, tooltip.caretY);
};
