import { differenceInCalendarDays, isToday } from "date-fns";
import type { BalanceData, Transaction } from "../types";

export function calculateBalanceData({
	budget,
	periodDate,
	transactions,
}: {
	budget: number;
	periodDate: Date;
	transactions: Transaction[];
}): BalanceData {
	const budgetPerDay = getBudgetPerDay(budget, periodDate);
	const totalSpent = getTotalSpent(transactions);
	const averageSpentPerDay = getAverageSpentPerDay(
		totalSpent,
		transactions.length,
	);
	const availableBudgetToday = getAvailableBudgetToday(
		budgetPerDay,
		transactions,
	);
	return {
		availableBudgetToday,
		averageSpentPerDay,
		budget: transactions.length > 0 ? budget - totalSpent : budget,
		budgetPerDay,
		periodDate,
		transactions,
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
