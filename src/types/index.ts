export const TIMEFRAMES = [
	"День",
	"Неделя",
	"2 недели",
	"Месяц",
	"До конца месяца",
	"Своя дата",
] as const;

export type Timeframe = (typeof TIMEFRAMES)[number];

export type BalanceData = {
	budget: number | null;
	periodDate: Date | null;
	transactions: Transaction[];
	budgetPerDay: number | null;
	availableBudgetToday: number | null;
	averageSpentPerDay: number | null;
};

export type Transaction = {
	// TODO:there probably will be id by indexDB
	id: string;
	amount: number;
	date: Date;
};

export type StateManager = {
	increaseBudget: (amount: number) => void;
	addTransaction: (transaction: Transaction) => void;
	removeTransaction: (transactionId: Transaction["id"]) => void;

	setPeriodDate: (periodDate: Date) => void;
	setBudget: (budget: number) => void;
	getPeriodDate: () => BalanceData["periodDate"] | null;
	getBudget: () => BalanceData["budget"] | null;
	getBudgetPerDay: () => BalanceData["budgetPerDay"] | null;
	getAvailableBudgetToday: () => BalanceData["availableBudgetToday"] | null;
	getTransactionHistory: () => BalanceData["transactions"];
	getAverageSpentPerDay: () => BalanceData["averageSpentPerDay"] | null;
	getBalanceData: () => BalanceData;
};

export type BalanceBlockRender = Pick<
	BalanceData,
	"budget" | "periodDate" | "budgetPerDay"
>;

export type BalanceTodayBlockRender = Pick<
	BalanceData,
	"availableBudgetToday" | "budgetPerDay"
>;

export type HistoryBlockRender = Pick<
	BalanceData,
	"transactions" | "averageSpentPerDay"
>;
