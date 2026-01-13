import {
	calculateInitialBalance,
	calculateNewTransaction,
	calculateRemoveTransaction,
	calculateUpdatedBalance,
} from "../services/budget-calculator";
import type {
	BalanceData,
	NonNullableBalanceData,
	Transaction,
	StateManager as TStateManager,
} from "../types/index";
import { db } from "./db";

export class StateManager implements TStateManager {
	private balanceData: BalanceData;
	constructor(defaultData: BalanceData) {
		this.balanceData = defaultData;
	}

	setInitialBudget({
		budget,
		periodDate,
	}: {
		budget: number;
		periodDate: Date;
	}) {
		const balanceData = calculateInitialBalance({
			budget,
			periodDate,
		});

		return this.setBalanceData(balanceData);
	}

	updateBalance({ budget, periodDate }: { budget: number; periodDate: Date }) {
		if (this.balanceData.budget === null || !this.balanceData.periodDate)
			throw new Error("onCalculateBudget: balance data is undefined!");

		const newBalanceData = calculateUpdatedBalance({
			oldBalanceData: this.balanceData as NonNullableBalanceData,
			newBudget: budget,
			newPeriodDate: periodDate,
		});

		return this.setBalanceData(newBalanceData);
	}

	addTransaction(transaction: Transaction) {
		if (this.balanceData.budget === null || !this.balanceData.periodDate)
			throw new Error("onCalculateBudget: balance data is undefined!");

		const newBalanceData = calculateNewTransaction({
			balanceData: this.balanceData as NonNullableBalanceData,
			transaction,
		});

		return this.setBalanceData(newBalanceData);
	}

	deleteTransaction(transactionId: string) {
		if (this.balanceData.budget === null || !this.balanceData.periodDate)
			throw new Error("handleTransactionDelete: balance data is undefined!");

		const { transactions } = this.balanceData;

		const deletedTransactionIdx = transactions.findIndex(
			({ id }) => id === transactionId,
		);

		if (deletedTransactionIdx === -1) return;
		const removedTransaction = transactions[deletedTransactionIdx];

		const newBalanceData = calculateRemoveTransaction({
			balanceData: this.balanceData as NonNullableBalanceData,
			newTransactions: transactions.filter(({ id }) => id !== transactionId),
			removedTransaction: removedTransaction,
		});

		return this.setBalanceData(newBalanceData);
	}

	async setBalanceData(data: BalanceData) {
		// TODO: validate data here with zod
		try {
			const updated = await db.updateBalance(() => data);
			this.balanceData = updated;
			return this.balanceData;
		} catch (error) {
			console.error(error);
		}
	}
	getBalanceData() {
		return this.balanceData;
	}
}
