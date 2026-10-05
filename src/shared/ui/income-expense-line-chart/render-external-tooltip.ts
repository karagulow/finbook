import type { Chart, TooltipModel } from 'chart.js';
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
		el.style.opacity = '0';
		return;
	}

	const index = tooltip.dataPoints[0].dataIndex;
	const point = details.dataPoints[index];
	if (!point) {
		el.style.opacity = '0';
		return;
	}

	const accumulated = details.accumulated[index] ?? 0;
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
		if (accumulated !== 0) {
			appendLine(
				'mt-0.5 text-[var(--accent)]',
				`Накоплено: ${formatAmount(accumulated, details.currency, true)}`,
			);
		}
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
			`mt-0.5 ${monthDifference < 0 ? 'text-[var(--wrong)]' : 'text-[var(--success)]'}`,
			`Разница: ${formatAmount(monthDifference, details.currency, true)}`,
		);
		appendLine(
			'mt-0.5 text-[var(--accent)]',
			`Накоплено: ${formatAmount(accumulated, details.currency, true)}`,
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
	el.style.opacity = '1';
	el.style.left = `${tooltip.caretX}px`;
	el.style.top = `${tooltip.caretY}px`;
	el.style.transform = openToLeft
		? 'translate(calc(-100% - 14px), 0)'
		: 'translate(14px, 0)';
};
