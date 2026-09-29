export const debtCurrencyLabel = (
	debt: { currencyCode?: string; currencySymbol?: string | null },
	fallback = '₽',
) => debt.currencySymbol || debt.currencyCode || fallback;