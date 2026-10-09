import { DateTime } from 'luxon';
import ExcelJS from 'exceljs';
import type { Worksheet } from 'exceljs';

export type ExportSections = {
	accounts: boolean;
	categories: boolean;
	transactions: boolean;
	goals: boolean;
	debts: boolean;
};

export type ExportCurrency = {
	code: string;
};

export type ExportAccount = {
	name: string;
	balance: number;
	currency: ExportCurrency;
};

export type ExportSubcategory = {
	name: string;
};

export type ExportCategory = {
	name: string;
	type: 'INCOME' | 'EXPENSE';
	icon: string;
	color: string;
	subcategories: ExportSubcategory[];
};

export type ExportTransaction = {
	type: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'GOAL' | 'DEBT';
	date: Date;
	description: string | null;
	amount: number | null;
	amountFrom: number | null;
	amountTo: number | null;
	goalType: 'DEPOSIT' | 'WITHDRAW' | null;
	debtAction: 'ISSUE' | 'REPAY' | null;
	account: { name: string; currency: ExportCurrency } | null;
	accountFrom: { name: string; currency: ExportCurrency } | null;
	accountTo: { name: string; currency: ExportCurrency } | null;
	category: { name: string } | null;
	subcategory: { name: string } | null;
	goal: { name: string } | null;
	debt: { name: string } | null;
};

export type ExportGoal = {
	name: string;
	targetAmount: number;
	savedAmount: number;
	deadline: Date;
	description: string | null;
};

export type ExportDebt = {
	name: string;
	type: 'OWED_TO_ME' | 'OWED_BY_ME';
	targetAmount: number;
	savedAmount: number;
	paid: boolean;
	deadline: Date;
	description: string | null;
	accountName: string | null;
	currencyCode: string;
};

export type ExportWorkbookData = {
	timeZone: string;
	currencyCode: string;
	sections: ExportSections;
	accounts: ExportAccount[];
	categories: ExportCategory[];
	transactions: ExportTransaction[];
	goals: ExportGoal[];
	debts: ExportDebt[];
};

const TRANSACTION_TYPE_LABEL = {
	INCOME: 'Доход',
	EXPENSE: 'Расход',
	TRANSFER: 'Перевод',
	GOAL: 'Цель',
	DEBT: 'Долг',
} as const;

const GOAL_ACTION_LABEL = {
	DEPOSIT: 'Пополнение',
	WITHDRAW: 'Снятие',
} as const;

const DEBT_ACTION_LABEL = {
	ISSUE: 'Выдача',
	REPAY: 'Возврат',
} as const;

const DEBT_TYPE_LABEL = {
	OWED_TO_ME: 'Мне должны',
	OWED_BY_ME: 'Я должен',
} as const;

const CATEGORY_TYPE_LABEL = {
	INCOME: 'Доход',
	EXPENSE: 'Расход',
} as const;

const MONEY_FORMAT = '#,##0.00';
const DATE_FORMAT = 'dd.mm.yyyy';

const roundMoney = (value: number) => Math.round(value * 100) / 100;

export const resolveTimeZone = (timeZone: unknown) => {
	if (typeof timeZone !== 'string' || timeZone.length === 0 || timeZone.length > 100) {
		return 'UTC';
	}

	return DateTime.now().setZone(timeZone).isValid ? timeZone : 'UTC';
};

export const exportFileName = (timeZone: string) => {
	const day = DateTime.now().setZone(timeZone).toFormat('yyyy-MM-dd');
	return `finbook-${day}.xlsx`;
};

const calendarDate = (date: Date, timeZone: string) => {
	const zoned = DateTime.fromJSDate(date, { zone: 'utc' }).setZone(timeZone);
	return new Date(Date.UTC(zoned.year, zoned.month - 1, zoned.day));
};

const prepareSheet = (sheet: Worksheet, headers: string[], widths: number[]) => {
	const header = sheet.addRow(headers);
	header.font = { bold: true };
	header.eachCell(cell => {
		cell.fill = {
			type: 'pattern',
			pattern: 'solid',
			fgColor: { argb: 'FFF1F1F1' },
		};
	});

	sheet.views = [{ state: 'frozen', ySplit: 1 }];
	sheet.autoFilter = {
		from: { row: 1, column: 1 },
		to: { row: 1, column: headers.length },
	};

	widths.forEach((width, index) => {
		sheet.getColumn(index + 1).width = width;
	});
};

const writeMoney = (sheet: Worksheet, row: number, column: number, value: number | null) => {
	if (value == null || !Number.isFinite(value)) return;

	const cell = sheet.getRow(row).getCell(column);
	cell.value = roundMoney(value);
	cell.numFmt = MONEY_FORMAT;
};

const writeDate = (
	sheet: Worksheet,
	row: number,
	column: number,
	value: Date,
	timeZone: string,
) => {
	const cell = sheet.getRow(row).getCell(column);
	cell.value = calendarDate(value, timeZone);
	cell.numFmt = DATE_FORMAT;
};

const addAccountsSheet = (workbook: ExcelJS.Workbook, accounts: ExportAccount[]) => {
	const sheet = workbook.addWorksheet('Счета');
	prepareSheet(sheet, ['Название', 'Валюта', 'Баланс'], [28, 12, 16]);

	accounts.forEach(account => {
		const row = sheet.addRow([account.name, account.currency.code, null]);
		writeMoney(sheet, row.number, 3, account.balance);
	});
};

const addCategoriesSheet = (
	workbook: ExcelJS.Workbook,
	categories: ExportCategory[],
) => {
	const sheet = workbook.addWorksheet('Категории');
	prepareSheet(
		sheet,
		['Тип', 'Категория', 'Подкатегория', 'Иконка', 'Цвет'],
		[12, 24, 24, 12, 14],
	);

	const ordered = [...categories].sort((a, b) => {
		if (a.type === b.type) return 0;
		return a.type === 'INCOME' ? -1 : 1;
	});

	ordered.forEach(category => {
		sheet.addRow([
			CATEGORY_TYPE_LABEL[category.type],
			category.name,
			null,
			category.icon,
			category.color,
		]);

		category.subcategories.forEach(subcategory => {
			sheet.addRow([
				CATEGORY_TYPE_LABEL[category.type],
				category.name,
				subcategory.name,
				category.icon,
				category.color,
			]);
		});
	});
};

const addTransactionsSheet = (
	workbook: ExcelJS.Workbook,
	transactions: ExportTransaction[],
	currencyCode: string,
	timeZone: string,
) => {
	const sheet = workbook.addWorksheet('Операции');
	prepareSheet(
		sheet,
		[
			'Дата',
			'Тип',
			'Сумма',
			'Валюта',
			'Счёт',
			'Счёт списания',
			'Сумма списания',
			'Валюта списания',
			'Счёт зачисления',
			'Сумма зачисления',
			'Валюта зачисления',
			'Категория',
			'Подкатегория',
			'Цель или долг',
			'Действие',
			'Комментарий',
		],
		[14, 12, 14, 12, 22, 22, 18, 18, 22, 20, 20, 20, 20, 24, 16, 36],
	);

	transactions.forEach(transaction => {
		const row = sheet.addRow([
			null,
			TRANSACTION_TYPE_LABEL[transaction.type],
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			transaction.category?.name ?? null,
			transaction.subcategory?.name ?? null,
			transaction.goal?.name ?? transaction.debt?.name ?? null,
			null,
			transaction.description,
		]);

		writeDate(sheet, row.number, 1, transaction.date, timeZone);

		if (transaction.type === 'TRANSFER') {
			row.getCell(6).value = transaction.accountFrom?.name ?? null;
			row.getCell(8).value = transaction.accountFrom?.currency.code ?? null;
			row.getCell(9).value = transaction.accountTo?.name ?? null;
			row.getCell(11).value = transaction.accountTo?.currency.code ?? null;
			writeMoney(sheet, row.number, 7, transaction.amountFrom);
			writeMoney(sheet, row.number, 10, transaction.amountTo);
			return;
		}

		row.getCell(5).value = transaction.account?.name ?? null;

		if (transaction.type === 'GOAL') {
			row.getCell(4).value = currencyCode;
			row.getCell(15).value = transaction.goalType
				? GOAL_ACTION_LABEL[transaction.goalType]
				: null;
			writeMoney(sheet, row.number, 3, transaction.amount);
			return;
		}

		row.getCell(4).value = transaction.account?.currency.code ?? currencyCode;

		if (transaction.type === 'DEBT') {
			row.getCell(15).value = transaction.debtAction
				? DEBT_ACTION_LABEL[transaction.debtAction]
				: null;
		}

		writeMoney(sheet, row.number, 3, transaction.amount);
	});
};

const addGoalsSheet = (
	workbook: ExcelJS.Workbook,
	goals: ExportGoal[],
	currencyCode: string,
	timeZone: string,
) => {
	const sheet = workbook.addWorksheet('Цели');
	prepareSheet(
		sheet,
		['Название', 'Цель', 'Накоплено', 'Валюта', 'Дедлайн', 'Комментарий'],
		[28, 16, 16, 12, 14, 36],
	);

	goals.forEach(goal => {
		const row = sheet.addRow([
			goal.name,
			null,
			null,
			currencyCode,
			null,
			goal.description,
		]);
		writeMoney(sheet, row.number, 2, goal.targetAmount);
		writeMoney(sheet, row.number, 3, goal.savedAmount);
		writeDate(sheet, row.number, 5, goal.deadline, timeZone);
	});
};

const addDebtsSheet = (
	workbook: ExcelJS.Workbook,
	debts: ExportDebt[],
	timeZone: string,
) => {
	const sheet = workbook.addWorksheet('Долги');
	prepareSheet(
		sheet,
		[
			'Название',
			'Тип',
			'Сумма',
			'Остаток',
			'Погашен',
			'Валюта',
			'Дедлайн',
			'Счёт',
			'Комментарий',
		],
		[28, 16, 16, 16, 12, 12, 14, 22, 36],
	);

	debts.forEach(debt => {
		const remaining = roundMoney(Math.max(0, debt.targetAmount - debt.savedAmount));
		const row = sheet.addRow([
			debt.name,
			DEBT_TYPE_LABEL[debt.type],
			null,
			null,
			debt.paid ? 'Да' : 'Нет',
			debt.currencyCode,
			null,
			debt.accountName,
			debt.description,
		]);
		writeMoney(sheet, row.number, 3, debt.targetAmount);
		writeMoney(sheet, row.number, 4, remaining);
		writeDate(sheet, row.number, 7, debt.deadline, timeZone);
	});
};

export const buildWorkbook = async (data: ExportWorkbookData) => {
	const workbook = new ExcelJS.Workbook();
	workbook.creator = 'Finbook';
	workbook.created = new Date();

	if (data.sections.accounts) {
		addAccountsSheet(workbook, data.accounts);
	}

	if (data.sections.categories) {
		addCategoriesSheet(workbook, data.categories);
	}

	if (data.sections.transactions) {
		addTransactionsSheet(
			workbook,
			data.transactions,
			data.currencyCode,
			data.timeZone,
		);
	}

	if (data.sections.goals) {
		addGoalsSheet(workbook, data.goals, data.currencyCode, data.timeZone);
	}

	if (data.sections.debts) {
		addDebtsSheet(workbook, data.debts, data.timeZone);
	}

	return workbook.xlsx.writeBuffer();
};
