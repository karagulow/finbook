import { differenceInCalendarDays, format, startOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';

export interface DebtDeadlineNote {
	text: string;
	urgent: boolean;
}

const plural = (value: number, one: string, few: string, many: string) => {
	const abs = Math.abs(value) % 100;
	const last = abs % 10;

	if (abs > 10 && abs < 20) return many;
	if (last > 1 && last < 5) return few;
	if (last === 1) return one;
	return many;
};

export const getDebtDeadlineNote = (
	deadline: string,
	now = new Date(),
): DebtDeadlineNote | null => {
	const date = startOfDay(new Date(deadline));

	if (Number.isNaN(date.getTime())) return null;

	const daysLeft = differenceInCalendarDays(date, startOfDay(now));

	if (daysLeft < 0) {
		return { text: 'Срок прошёл', urgent: true };
	}

	if (daysLeft === 0) {
		return { text: 'Сегодня', urgent: true };
	}

	if (daysLeft < 30) {
		return {
			text: `через ${daysLeft} ${plural(daysLeft, 'день', 'дня', 'дней')}`,
			urgent: true,
		};
	}

	return {
		text: `до ${format(date, 'd MMMM yyyy', { locale: ru })}`,
		urgent: false,
	};
};
