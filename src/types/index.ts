export const TIMEFRAMES = [
	"День",
	"Неделя",
	"2 недели",
	"Месяц",
	"До конца месяца",
	"Своя дата",
] as const;

export type Timeframe = (typeof TIMEFRAMES)[number];

export const ROUTER_PATHS = {
	HOME: "/",
	START: "/start",
	BALANCE: "/balance",
	HISTORY: "/history",
	NOT_FOUND: "/404",
} as const;

type Routes = typeof ROUTER_PATHS;
export type Route = Routes[keyof Routes];

export type BalanceData = {
	budget: number | null;
	periodDate: Date | null;
	transactions: Transaction[];
	budgetPerDay: number | null;
	availableBudgetToday: number | null;
	averageSpentPerDay: number;
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
	getPeriodDate: () => BalanceData["periodDate"];
	getBudget: () => BalanceData["budget"];
	getBudgetPerDay: () => BalanceData["budgetPerDay"];
	getAvailableBudgetToday: () => BalanceData["availableBudgetToday"];
	getTransactionHistory: () => BalanceData["transactions"];
	getAverageSpentPerDay: () => BalanceData["averageSpentPerDay"];
	getBalanceData: () => BalanceData;
};

export type NonNullableBalanceData = {
	[K in keyof BalanceData]: NonNullable<BalanceData[K]>;
};

export type HistoryPageUpdate = HistoryBlockUpdate;
export type HomePageUpdate = BalanceBlockUpdate &
	BalanceTodayBlockUpdate &
	HistoryBlockUpdate;
export type BalancePageUpdate = BalanceBlockUpdate;

export type BalanceBlockUpdate = Pick<
	BalanceData,
	"budget" | "budgetPerDay" | "periodDate"
>;

export type HistoryBlockUpdate = Pick<
	BalanceData,
	"transactions" | "averageSpentPerDay"
>;

export type BalanceTodayBlockUpdate = Pick<
	BalanceData,
	"availableBudgetToday" | "budgetPerDay"
>;

export type BalanceViewUpdate = BalanceBlockUpdate;

export type BudgetFormData = Pick<
	NonNullableBalanceData,
	"budget" | "periodDate"
>;

export type OnCalculateBudget = ({
	budget,
	periodDate,
}: BudgetFormData) => void;
