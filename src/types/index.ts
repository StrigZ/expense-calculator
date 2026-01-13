import type { Budget } from "../models/budget";
import type { Metrics } from "../models/metrics";
import type { Transaction } from "../models/transaction";

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
} as const;

type Routes = typeof ROUTER_PATHS;
export type Route = Routes[keyof Routes];

export type StateManager = {
	setData: ({
		budget,
		transactions,
	}: {
		budget: Budget;
		transactions: Transaction[];
	}) => void;
	getMetrics: () => Metrics | null;
};

export type HistoryPageUpdate = {
	metrics: Metrics;
	transactions: Transaction[];
};

export type HomePageUpdate = {
	metrics: Metrics;
	transactions: Transaction[];
};

export type HistoryBlockUpdate = {
	metrics: Metrics;
	transactions: Transaction[];
};

export type HistoryPageConstructor = {
	transactions: Transaction[];
	goToHomePage: () => void;
	handleTransactionDelete: (transactionId: string) => void;
};
export type HomePageConstructor = {
	transactions: Transaction[];
	handleNewTransaction: (transaction: Transaction) => void;
	goToHistoryPage: () => void;
	goToHomePage: () => void;
	goToTopupPage: () => void;
};
export type StartPageConstructor = {
	onSubmit: onBudgetFormSubmit;
};
export type TopupPageConstructor = {
	onSubmit: onBudgetFormSubmit;
};

export type BalanceBlockConstructor = {
	goToTopupPage: () => void;
	goToHistoryPage: () => void;
};
export type BalanceTodayBlockConstructor = {
	handleNewTransaction: (transaction: Transaction) => void;
};
export type HistoryBlockConstructor = {
	transactions: Transaction[];
	navButtonText: string;
	canDeleteTransactions: boolean;
	onNavButtonClick: () => void;
	handleTransactionDelete?: (transactionId: string) => void;
};
export type TopupBlockConstructor = {
	onSubmit: onBudgetFormSubmit;
};
export type StartBlockConstructor = {
	onSubmit: onBudgetFormSubmit;
};

export type InputContsructor = {
	labelText: string;
	placeholderText: string;
	isRequired: boolean;
	type?: "text" | "number";
	inputMode?: "text" | "numeric";
	onChange: (value: string) => void;
};
export type ButtonConstructor = {
	text: string;
	variant?: "primary" | "outline";
	className?: string;
	type?: "submit" | "button";
	onClick?: (e: Event) => void;
	disabled?: boolean;
};
export type ContainerConstructor = {
	tag?: keyof HTMLElementTagNameMap;
	className?: string;
};

export type BudgetFormConstructor = {
	onSubmit: onBudgetFormSubmit;
	inputLabelText?: string;
	submitButtonText?: string;
};

export type onBudgetFormSubmit = ({
	endDate,
	inputValue,
}: {
	endDate: Budget["endDate"];
	inputValue: Budget["initialBalance"] | Transaction["amount"];
}) => void;

export type TopupPageUpdate = {
	endDate: Budget["endDate"];
	metrics: Metrics;
};

export type TopupBlockUpdate = {
	endDate: Budget["endDate"];
	metrics: Metrics;
};
