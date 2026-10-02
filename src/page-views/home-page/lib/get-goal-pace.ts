import { differenceInCalendarDays, startOfDay } from 'date-fns';

interface GoalPaceInput {
	savedAmount: number;
	targetAmount: number;
	deadline: string;
	createdAt: string;
}

export type GoalPaceKind =
	| 'overdue'
	| 'due-today'
	| 'due-soon'
	| 'behind'
	| 'on-track';

export interface GoalPace {
	kind: GoalPaceKind;
	text: string;
}

const formatMoney = (value: number, currency: string) =>
	`${Math.round(value).toLocaleString('ru-RU')} ${currency}`;

const plural = (value: number, one: string, few: string, many: string) => {
	const abs = Math.abs(value) % 100;
	const last = abs % 10;

	if (abs > 10 && abs < 20) return many;
	if (last > 1 && last < 5) return few;
	if (last === 1) return one;
	return many;
};

export const getGoalPace = (
	goal: GoalPaceInput,
	currency: string,
	now = new Date(),
): GoalPace | null => {
	if (goal.targetAmount <= 0) return null;

	const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
	const today = startOfDay(now);
	const deadline = startOfDay(new Date(goal.deadline));
	const createdAt = startOfDay(new Date(goal.createdAt));

	if (Number.isNaN(deadline.getTime()) || Number.isNaN(createdAt.getTime())) {
		return null;
	}

	const daysLeft = differenceInCalendarDays(deadline, today);

	if (daysLeft < 0) {
		return {
			kind: 'overdue',
			text: `Срок прошёл, осталось ${formatMoney(remaining, currency)}`,
		};
	}

	if (daysLeft === 0) {
		return {
			kind: 'due-today',
			text: `Нужно ещё ${formatMoney(remaining, currency)} сегодня`,
		};
	}

	if (daysLeft < 30) {
		const daysLabel = plural(daysLeft, 'день', 'дня', 'дней');
		return {
			kind: 'due-soon',
			text: `До срока ${daysLeft} ${daysLabel}, нужно ещё ${formatMoney(remaining, currency)}`,
		};
	}

	const totalDays = Math.max(1, differenceInCalendarDays(deadline, createdAt));
	const elapsedDays = differenceInCalendarDays(today, createdAt);
	const fraction = Math.min(1, Math.max(0, elapsedDays / totalDays));
	const behind = goal.targetAmount * fraction - goal.savedAmount;

	if (Math.round(behind) >= 1) {
		return {
			kind: 'behind',
			text: `Отстаёте примерно на ${formatMoney(behind, currency)}`,
		};
	}

	const perMonth = remaining / (daysLeft / 30.4375);

	return {
		kind: 'on-track',
		text: `Откладывать ${formatMoney(perMonth, currency)} в месяц`,
	};
};
