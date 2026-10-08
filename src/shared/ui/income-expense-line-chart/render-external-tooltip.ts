import type { Chart, TooltipModel } from 'chart.js';
import { hideChartTooltip, placeChartTooltip } from '../chart-tooltip-motion';
import { formatAmount } from './lib';
import type { LineChartTooltipDetails } from './types';

const VISIBLE_CATEGORIES = 4;

export const renderExternalTooltip = (
	el: HTMLDivElement,
	context: { chart: Chart; tooltip: TooltipModel<'line'> },
	details: LineChartTooltipDetails,
) => {
	const { tooltip, chart } = context;

	if (tooltip.opacity === 0 || !tooltip.dataPoints.length) {
		hideChartTooltip(el);
		return;
	}

	const index = tooltip.dataPoints[0].dataIndex;
	const point = details.dataPoints[index];
	if (!point) {
		hideChartTooltip(el);
		return;
	}

	const monthDifference = point.income - point.expense;

	el.replaceChildren();

	const title = document.createElement('div');
	title.className = 'font-medium text-[13px]';
	title.textContent = `${point.label} ${details.year}`;
	el.append(title);

	const appendLine = (className: string, text: string) => {
		const line = document.createElement('div');
		line.className = className;
		line.textContent = text;
		el.append(line);
	};

	if (point.income <= 0 && point.expense <= 0) {
		appendLine('mt-1.5 text-[var(--foreground-secondary)]', 'Операций не было');
	} else {
		appendLine(
			'mt-1.5 text-[var(--success)]',
			point.income <= 0
				? 'Доходов не было'
				: `Доходы: ${formatAmount(point.income, details.currency)}`,
		);
		appendLine(
			'mt-0.5 text-[var(--wrong)]',
			point.expense <= 0
				? 'Расходов не было'
				: `Расходы: ${formatAmount(point.expense, details.currency)}`,
		);
		appendLine(
			`mt-0.5 ${monthDifference < 0 ? 'text-[var(--wrong)]' : 'text-[var(--accent)]'}`,
			`Разница: ${formatAmount(monthDifference, details.currency, true)}`,
		);

		if (point.expense > 0) {
			const share =
				details.yearExpense > 0
					? Math.round((point.expense / details.yearExpense) * 100)
					: 0;
			appendLine(
				'mt-0.5 text-[var(--foreground-secondary)]',
				`${share}% от расходов за год`,
			);

			const categories = point.categories ?? [];
			if (categories.length > 0) {
				const list = document.createElement('div');
				list.className =
					'mt-2 flex flex-col gap-0.5 border-t border-[var(--border-primary)] pt-2';

				for (const category of categories.slice(0, VISIBLE_CATEGORIES)) {
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
	}

	const canvas = chart.canvas;
	const openToLeft = tooltip.caretX > canvas.clientWidth * 0.62;
	const x = openToLeft
		? tooltip.caretX - el.offsetWidth - 14
		: tooltip.caretX + 14;

	placeChartTooltip(el, x, tooltip.caretY);
};
