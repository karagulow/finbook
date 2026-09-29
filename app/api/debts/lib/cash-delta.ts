export type DebtCashType = 'OWED_TO_ME' | 'OWED_BY_ME';
export type DebtCashAction = 'ISSUE' | 'REPAY';

export const roundMoney = (value: number) => Math.round(value * 100) / 100;

export const cashDelta = (
	type: DebtCashType,
	action: DebtCashAction,
	amount: number,
) => {
	const moneyLeaves =
		(type === 'OWED_TO_ME' && action === 'ISSUE') ||
		(type === 'OWED_BY_ME' && action === 'REPAY');

	return moneyLeaves ? -roundMoney(amount) : roundMoney(amount);
};
