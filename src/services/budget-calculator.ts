import { differenceInCalendarDays, isToday } from "date-fns";
import type {
	BalanceData,
	NonNullableBalanceData,
	Transaction,
} from "../types";

export function calculateRemoveTransaction({
	balanceData,
	newTransactions,
	removedTransaction,
}: {
	balanceData: NonNullableBalanceData;
	newTransactions: Transaction[];
	removedTransaction: Transaction;
}): BalanceData {
	const totalSpent = getTotalSpent(newTransactions);
	const averageSpentPerDay = getAverageSpentPerDay(
		totalSpent,
		newTransactions.length,
	);
	const newBudget = balanceData.budget + removedTransaction.amount;
	const newBudgetPerDay = getBudgetPerDay(newBudget, balanceData.periodDate);
	const newAvailableBudgetToday =
		balanceData.availableBudgetToday +
		removedTransaction.amount +
		getBudgetPerDay(removedTransaction.amount, balanceData.periodDate);

	return {
		...balanceData,
		availableBudgetToday: newAvailableBudgetToday,
		averageSpentPerDay,
		budgetPerDay: newBudgetPerDay,
		budget: newBudget,
		transactions: newTransactions,
	};
}

export function calculateNewTransaction({
	balanceData,
	transaction,
}: {
	balanceData: NonNullableBalanceData;
	transaction: Transaction;
}): BalanceData {
	const newTransactions = [...balanceData.transactions, transaction];
	const totalSpent = getTotalSpent(newTransactions);
	const averageSpentPerDay = getAverageSpentPerDay(
		totalSpent,
		newTransactions.length,
	);

	return {
		...balanceData,
		availableBudgetToday: balanceData.availableBudgetToday - transaction.amount,
		averageSpentPerDay,
		budget: balanceData.budget - transaction.amount,
		transactions: newTransactions,
	};
}

export function calculateInitialBalance({
	budget,
	periodDate,
}: {
	budget: number;
	periodDate: Date;
}): BalanceData {
	const budgetPerDay = getBudgetPerDay(budget, periodDate);

	return {
		availableBudgetToday: budgetPerDay,
		averageSpentPerDay: 0,
		budget,
		budgetPerDay,
		periodDate,
		transactions: [],
	};
}

export function calculateUpdatedBalance({
	oldBalanceData,
	newBudget,
	newPeriodDate,
}: {
	oldBalanceData: NonNullableBalanceData;
	newBudget: number;
	newPeriodDate: Date;
}): BalanceData {
	const { budget: oldBudget } = oldBalanceData;

	const newBudgetPerDay = getBudgetPerDay(oldBudget + newBudget, newPeriodDate);

	const newAvailableBudgetToday = getAvailableBudgetToday(
		newBudgetPerDay,
		oldBalanceData.transactions,
	);

	return {
		...oldBalanceData,
		availableBudgetToday: newAvailableBudgetToday,
		budget: oldBudget + newBudget,
		budgetPerDay: newBudgetPerDay,
		periodDate: newPeriodDate,
	};
}

function getTotalSpent(transactions: Transaction[]) {
	return transactions.reduce((prev, curr) => prev + curr.amount, 0);
}

function getBudgetPerDay(budget: number, periodDate: Date) {
	return Math.floor(budget / differenceInCalendarDays(periodDate, new Date()));
}

function getAverageSpentPerDay(totalSpent: number, transactionsAmount: number) {
	return transactionsAmount > 0 ? totalSpent / transactionsAmount : 0;
}

function getAvailableBudgetToday(
	budgetPerDay: number,
	transactions: Transaction[],
) {
	const transactionsToday = transactions.filter(({ date }) => isToday(date));

	const spentToday = transactionsToday.reduce(
		(prev, curr) => prev + curr.amount,
		0,
	);

	return budgetPerDay - spentToday;
}
