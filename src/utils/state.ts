import { calculateBalanceData } from "../services/budget-calculator";
import type {
	BalanceData,
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
		const balanceData = calculateBalanceData({
			budget,
			periodDate,
			transactions: [],
		});

		return this.setBalanceData(balanceData);
	}

	updateBalance({ budget, periodDate }: { budget: number; periodDate: Date }) {
		if (this.balanceData.budget === null || !this.balanceData.periodDate)
			throw new Error("onCalculateBudget: balance data is undefined!");

		const newBalanceData = calculateBalanceData({
			budget: this.balanceData.budget + budget,
			periodDate,
			transactions: this.balanceData.transactions,
		});

		return this.setBalanceData(newBalanceData);
	}

	addTransaction(transaction: Transaction) {
		if (this.balanceData.budget === null || !this.balanceData.periodDate)
			return;

		const { budget, periodDate, transactions } = this.balanceData;

		const newBalanceData = calculateBalanceData({
			budget: budget,
			periodDate: periodDate,
			transactions: [...transactions, transaction],
		});

		return this.setBalanceData(newBalanceData);
	}

	deleteTransaction(transactionId: string) {
		if (this.balanceData.budget === null || !this.balanceData.periodDate)
			throw new Error("handleTransactionDelete: balance data is undefined!");

		const { budget, periodDate, transactions } = this.balanceData;

		const deletedTransactionIdx = transactions.findIndex(
			({ id }) => id === transactionId,
		);

		if (deletedTransactionIdx === -1) return;
		const deletedTransaction = transactions[deletedTransactionIdx];

		const newBalanceData = calculateBalanceData({
			budget: budget + deletedTransaction.amount,
			periodDate: periodDate,
			transactions: transactions.filter(({ id }) => id !== transactionId),
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
