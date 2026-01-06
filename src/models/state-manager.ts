import { differenceInCalendarDays } from "date-fns";
import type {
	Transaction,
	StateManager as TStateManager,
} from "../types/index";

// TODO: use indexdb
export class StateManager implements TStateManager {
	private budget: number | null = null;
	private periodDate: Date | null = null;
	private transactions: Transaction[] = [];
	private budgetPerDay: number | null = null;
	private availableBudgetToday: number | null = null;
	private averageSpentPerDay: number | null = null;

	setPeriodDate(periodDate: Date) {
		this.periodDate = periodDate;
		this._calculateBudgetPerDay();
	}

	setBudget(budget: number) {
		this.budget = budget;
		this._calculateBudgetPerDay();
	}

	increaseBudget(amount: number) {
		if (!this.budget) return;

		this.budget += amount;
		this._calculateBudgetPerDay();
	}
	addTransaction(transaction: Transaction) {
		if (!this.budget || !this.availableBudgetToday) return;

		this.transactions.push(transaction);
		const { amount } = transaction;
		this.budget -= amount;
		this.availableBudgetToday -= amount;

		this._calculateAverageSpentPerDay();
	}
	removeTransaction(transactionId: Transaction["id"]) {
		if (!this.budget || !this.availableBudgetToday) return;

		const transactionIdx = this.transactions.findIndex(
			({ id }) => id === transactionId,
		);
		if (transactionIdx === -1) return;
		const transaction = this.transactions[transactionIdx];
		this.transactions = this.transactions.splice(transactionIdx, 1);

		const { amount, date } = transaction;
		this.budget += amount;
		if (date === new Date()) {
			this.availableBudgetToday += amount;
		}
		this._calculateAverageSpentPerDay();
	}
	getPeriodDate() {
		return this.periodDate;
	}
	getBudget() {
		return this.budget;
	}
	getTransactionHistory() {
		return this.transactions;
	}
	getBudgetPerDay() {
		return this.budgetPerDay;
	}
	getAvailableBudgetToday() {
		return this.availableBudgetToday;
	}
	getAverageSpentPerDay() {
		return this.averageSpentPerDay;
	}
	getBalanceData() {
		return {
			budget: this.budget,
			periodDate: this.periodDate,
			transactions: this.transactions,
			budgetPerDay: this.budgetPerDay,
			availableBudgetToday: this.availableBudgetToday,
			averageSpentPerDay: this.averageSpentPerDay,
		};
	}

	private _calculateBudgetPerDay() {
		if (!this.periodDate || !this.budget) return;

		this.budgetPerDay = Math.floor(
			this.budget / differenceInCalendarDays(this.periodDate, new Date()),
		);

		if (!this.availableBudgetToday) {
			this.availableBudgetToday = this.budgetPerDay;
		}
	}

	private _calculateAverageSpentPerDay() {
		this.averageSpentPerDay =
			this.transactions.reduce((prev, curr) => prev + curr.amount, 0) /
			this.transactions.length;
	}
}
