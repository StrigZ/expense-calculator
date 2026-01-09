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

export type NonNullableBudget = NonNullable<BalanceData["budget"]>;
export type NonNullablePeriod = NonNullable<BalanceData["periodDate"]>;
export type NonNullableBudgetPerDay = NonNullable<BalanceData["budgetPerDay"]>;

export type OnCalculateBudget = ({
	budget,
	periodDate,
}: BudgetFormData) => void;

export type BalanceBlockRender = BalanceViewRender;

export type BalanceTodayBlockRender = Pick<
	BalanceData,
	"availableBudgetToday" | "budgetPerDay"
>;

export type HistoryBlockRender = Pick<
	BalanceData,
	"transactions" | "averageSpentPerDay"
>;

export type BudgetFormData = {
	budget: NonNullableBudget;
	periodDate: NonNullablePeriod;
};

export type BalanceViewRender = {
	budget: NonNullableBudget;
	periodDate: NonNullablePeriod;
	budgetPerDay: NonNullableBudgetPerDay;
};
