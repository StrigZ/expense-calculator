import type { BalanceData, Timeframe } from "../types";

export const timeframeToNumberMap: Record<
	Exclude<Timeframe, "До конца месяца" | "Своя дата">,
	number
> = {
	День: 1,
	Неделя: 7,
	"2 недели": 14,
	Месяц: 30,
};

export const DEFAULT_BALANCE_DATA: BalanceData = {
	transactions: [],
	availableBudgetToday: null,
	budget: null,
	budgetPerDay: null,
	periodDate: null,
	averageSpentPerDay: 0,
};
