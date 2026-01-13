import type { Budget } from "../models/budget";
import type { Metrics } from "../models/metrics";
import type { Transaction } from "../models/transaction";
import { calculateMetrics } from "../services/budget-calculator";
import type { StateManager as TStateManager } from "../types/index";
import { db } from "./db";
import {
	isBudgetValid,
	isMetricsValid,
	isTransactionValid,
} from "./validation";

export class StateManager implements TStateManager {
	private budgetData: Budget | null = null;
	private transactions: Transaction[] = [];
	private metrics: Metrics | null = null;

	async updateEndDate(endDate: Date) {
		if (!this.budgetData) throw new Error("Budget is null!");
		if (endDate === this.budgetData.endDate) return;

		const newBudgetData: Budget = { ...this.budgetData, endDate };

		try {
			await db.saveBudget(newBudgetData);
			this.budgetData = newBudgetData;
			this.metrics = this._calculateMetrics();
		} catch (e) {
			console.error(e);
		}
	}

	async addTransaction(transaction: Transaction) {
		if (!isTransactionValid(transaction) || !this.budgetData) return;

		const updatedTransactions = [...this.transactions, transaction];

		try {
			await db.saveTransactions(updatedTransactions);
			this.transactions = updatedTransactions;
			this.metrics = this._calculateMetrics();
		} catch (e) {
			console.error(e);
		}
	}

	async deleteTransaction(transactionId: Transaction["id"]) {
		if (!this.budgetData) return;

		const deletedTransactionIdx = this.transactions.findIndex(
			({ id }) => id === transactionId,
		);

		if (deletedTransactionIdx === -1) return;

		const updatedTransactions = this.transactions.filter(
			({ id }) => id !== transactionId,
		);

		try {
			await db.saveTransactions(updatedTransactions);
			this.transactions = updatedTransactions;
			this.metrics = this._calculateMetrics();
		} catch (e) {
			console.error(e);
		}
	}

	async setInitialBudget(data: Budget) {
		if (!isBudgetValid(data)) return;

		try {
			await db.saveBudget(data);
			await db.saveTransactions([]);
			this.budgetData = data;
			this.transactions = [];
			this.metrics = this._calculateMetrics();
		} catch (e) {
			console.error(e);
		}
	}

	setData({
		budget,
		transactions,
	}: {
		budget: Budget;
		transactions: Transaction[];
	}) {
		if (!isBudgetValid(budget)) return;

		this.budgetData = budget;
		this.transactions = transactions;
		this.metrics = this._calculateMetrics();
	}

	setBudget(budget: Budget) {
		if (!isBudgetValid(budget)) return;

		this.budgetData = budget;
		this.metrics = this._calculateMetrics();
	}

	setTransactions(transactions: Transaction[]) {
		this.transactions = transactions;
		this.metrics = this._calculateMetrics();
	}

	getMetrics() {
		const metrics = this.metrics;
		if (!metrics) throw new Error("Metrics is null!");

		return metrics;
	}
	getTransactions() {
		return this.transactions;
	}
	getBudget() {
		const budgetData = this.budgetData;
		if (!budgetData) throw new Error("BudgetData is null!");

		return budgetData;
	}

	private _calculateMetrics() {
		const budgetData = this.budgetData;
		if (!budgetData) throw new Error("BudgetData is null!");

		const newMetrics = calculateMetrics({
			budget: budgetData,
			transactions: this.transactions,
		});

		if (!isMetricsValid(newMetrics))
			throw new Error("Calculated metrics are not valid!");

		return newMetrics;
	}
}
