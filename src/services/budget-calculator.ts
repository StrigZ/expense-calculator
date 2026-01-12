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
	const averageSpentPerDay = getAverageSpentPerDay(transactions);
	const availableBudgetToday = getAvailableBudgetToday(
		budgetPerDay,
		transactions,
	);

	return {
		availableBudgetToday,
		averageSpentPerDay,
		budget,
		budgetPerDay,
		periodDate,
		transactions,
	};
}

function getBudgetPerDay(budget: number, periodDate: Date) {
	return Math.floor(budget / differenceInCalendarDays(periodDate, new Date()));
}

function getAverageSpentPerDay(transactions: Transaction[]) {
	return transactions.length
		? transactions.reduce((prev, curr) => prev + curr.amount, 0) /
				transactions.length
		: 0;
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
