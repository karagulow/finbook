import type { Chart, TooltipModel } from 'chart.js';
import { formatAmount } from './lib';
import type { CategoryDoughnutTooltipDetails } from './types';

const TOOLTIP_MOVE_MS = 520;

type TooltipMotion = {
	shown: boolean;
	key: string;
};

const tooltipMotion = new WeakMap<HTMLElement, TooltipMotion>();

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

const prefersReducedMotion = () =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const placeTooltip = (el: HTMLElement, x: number, y: number, animate: boolean) => {
	const transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;

	if (!animate || prefersReducedMotion()) {
		el.style.transition = 'none';
		el.style.transform = transform;
		el.getBoundingClientRect();
		return;
	}

	el.style.transition = `transform ${TOOLTIP_MOVE_MS}ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease`;
	el.style.transform = transform;
};

export const renderExternalTooltip = (
	el: HTMLDivElement,
	context: { chart: Chart; tooltip: TooltipModel<'doughnut'> },
	details: CategoryDoughnutTooltipDetails,
) => {
	const { tooltip, chart } = context;
	const motion = tooltipMotion.get(el) ?? { shown: false, key: '' };
	tooltipMotion.set(el, motion);
	el.style.left = '0px';
	el.style.top = '0px';

	if (tooltip.opacity === 0 || !tooltip.dataPoints.length) {
		el.style.transition = prefersReducedMotion() ? 'none' : 'opacity 140ms ease';
		el.style.opacity = '0';
		motion.shown = false;
		return;
	}

	const category = details.categories[tooltip.dataPoints[0].dataIndex];
	if (!category) {
		el.style.opacity = '0';
		motion.shown = false;
		return;
	}

	const share =
		details.total > 0 ? Math.round((category.amount / details.total) * 100) : 0;
	const rank = details.categories.findIndex(item => item.id === category.id) + 1;
	const rest = details.total - category.amount;

	if (motion.key !== category.id) {
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

		motion.key = category.id;
	}

	const canvas = chart.canvas;
	const openToLeft = tooltip.caretX > canvas.clientWidth * 0.62;
	const x = openToLeft
		? tooltip.caretX - el.offsetWidth - 14
		: tooltip.caretX + 14;

	placeTooltip(el, x, tooltip.caretY, motion.shown);
	el.style.opacity = '1';
	motion.shown = true;
};
