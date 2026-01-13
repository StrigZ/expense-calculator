import { differenceInCalendarDays, isToday } from "date-fns";
import type { Budget } from "../models/budget";
import type { Metrics } from "../models/metrics";
import type { Transaction } from "../models/transaction";

export function calculateMetrics({
	budget,
	transactions,
}: {
	budget: Budget;
	transactions: Transaction[];
}): Metrics {
	const totalSpent = getTotalSpent(transactions);
	const availableBalance = budget.initialBalance - totalSpent;
	const daysLeft = differenceInCalendarDays(budget.endDate, budget.startDate);
	const budgetPerDay = getBudgetPerDay({
		availableBalance,
		daysLeft,
	});
	const avgSpentPerDay = getAverageSpentPerDay(totalSpent, transactions.length);
	const availableToday = getAvailableBudgetToday(budgetPerDay, transactions);

	return {
		availableBalance,
		availableToday,
		avgSpentPerDay,
		budgetPerDay,
		daysLeft,
	};
}

function getTotalSpent(transactions: Transaction[]) {
	return transactions.reduce(
		(prev, curr) =>
			curr.type === "expense" ? prev + curr.amount : prev - curr.amount,
		0,
	);
}

function getBudgetPerDay({
	daysLeft,
	availableBalance,
}: {
	daysLeft: Metrics["daysLeft"];
	availableBalance: Metrics["availableBalance"];
}) {
	return Math.floor(availableBalance / daysLeft);
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
		(prev, curr) =>
			curr.type === "expense" ? prev + curr.amount : prev - curr.amount,
		0,
	);

	return budgetPerDay - spentToday;
}
