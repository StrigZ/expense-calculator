import { differenceInCalendarDays, isAfter, isBefore, isToday } from "date-fns";
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
	const totalAdded = getTotalAdded(transactions);
	const availableBalance = budget.initialBalance - totalSpent + totalAdded;

	const today = new Date();
	let daysLeft = 0;
	let totalBudgetDays = 0;

	if (isBefore(today, budget.startDate)) {
		daysLeft = differenceInCalendarDays(budget.endDate, budget.startDate);
		totalBudgetDays = daysLeft;
	} else if (isAfter(today, budget.endDate)) {
		daysLeft = 0;
		totalBudgetDays = differenceInCalendarDays(
			budget.endDate,
			budget.startDate,
		);
	} else {
		daysLeft = differenceInCalendarDays(budget.endDate, today);
		totalBudgetDays = differenceInCalendarDays(
			budget.endDate,
			budget.startDate,
		);
	}

	const daysPassed = Math.max(0, totalBudgetDays - daysLeft);
	const budgetUsedSoFar = calculateBudgetUsedSoFar(
		transactions,
		budget,
		daysPassed,
	);
	const remainingBudget = budget.initialBalance + totalAdded - budgetUsedSoFar;

	const budgetPerDay = getBudgetPerDay({
		remainingBudget,
		daysLeft,
	});

	const avgSpentPerDay = getAverageSpentPerDay(transactions, budget);
	const availableToday = getAvailableBudgetToday(
		budgetPerDay,
		transactions,
		budget,
	);

	return {
		availableBalance,
		availableToday,
		avgSpentPerDay,
		budgetPerDay,
		daysLeft: Math.max(0, daysLeft),
	};
}

function getTotalAdded(transactions: Transaction[]) {
	return transactions
		.filter(({ type }) => type === "income")
		.reduce((prev, curr) => prev + curr.amount, 0);
}

function getTotalSpent(transactions: Transaction[]) {
	return transactions
		.filter(({ type }) => type === "expense")
		.reduce((prev, curr) => prev + curr.amount, 0);
}

function calculateBudgetUsedSoFar(
	transactions: Transaction[],
	budget: Budget,
	daysPassed: number,
): number {
	const totalSpent = getTotalSpent(transactions);
	const totalAdded = getTotalAdded(transactions);

	const totalBudget = budget.initialBalance + totalAdded;
	const dailyAllowance =
		totalBudget /
		Math.max(1, differenceInCalendarDays(budget.endDate, budget.startDate));

	const expectedSpending = dailyAllowance * daysPassed;

	return Math.min(totalSpent, expectedSpending);
}

function getBudgetPerDay({
	daysLeft,
	remainingBudget,
}: {
	daysLeft: number;
	remainingBudget: number;
}) {
	if (daysLeft <= 0) return 0;
	return remainingBudget / daysLeft;
}

function getAverageSpentPerDay(transactions: Transaction[], budget: Budget) {
	const expenses = transactions.filter(({ type }) => type === "expense");

	if (expenses.length === 0) return 0;

	const today = new Date();
	let daysPassed = 0;

	if (isBefore(today, budget.startDate)) {
		daysPassed = 0;
	} else if (isAfter(today, budget.endDate)) {
		daysPassed = differenceInCalendarDays(budget.endDate, budget.startDate);
	} else {
		daysPassed = differenceInCalendarDays(today, budget.startDate);
	}

	const effectiveDaysPassed = Math.max(1, daysPassed);
	const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);

	return totalSpent / effectiveDaysPassed;
}

function getAvailableBudgetToday(
	budgetPerDay: number,
	transactions: Transaction[],
	budget: Budget,
) {
	const today = new Date();

	if (isBefore(today, budget.startDate) || isAfter(today, budget.endDate)) {
		return 0;
	}

	const transactionsToday = transactions.filter(
		({ date, type }) => isToday(date) && type === "expense",
	);

	const spentToday = transactionsToday.reduce(
		(prev, curr) => prev + curr.amount,
		0,
	);

	return Math.max(0, budgetPerDay - spentToday);
}
