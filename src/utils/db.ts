import { type DBSchema, type IDBPDatabase, openDB } from "idb";
import type { Budget } from "../models/budget";
import type { Transaction } from "../models/transaction";

interface BudgetDBSchema extends DBSchema {
	balanceStore: {
		key: "current";
		value: Budget;
	};
	transactionStore: {
		key: "transactions";
		value: Transaction[];
	};
}

export class DB {
	private dbPromise: Promise<IDBPDatabase<BudgetDBSchema>>;
	private static readonly FIXED_BUDGET_KEY = "current" as const;
	private static readonly FIXED_TRANSACTIONS_KEY = "transactions" as const;

	constructor() {
		this.dbPromise = openDB<BudgetDBSchema>("budget-db", 1, {
			upgrade(db) {
				db.createObjectStore("balanceStore");
				db.createObjectStore("transactionStore");
			},
		});
	}

	async saveBudget(data: Budget): Promise<void> {
		const db = await this.dbPromise;
		const tx = db.transaction("balanceStore", "readwrite");
		await tx.store.put(data, DB.FIXED_BUDGET_KEY);
		await tx.done;
	}

	async saveTransactions(transactions: Transaction[]): Promise<void> {
		const db = await this.dbPromise;
		const tx = db.transaction("transactionStore", "readwrite");
		await tx.store.put(transactions, DB.FIXED_TRANSACTIONS_KEY);
		await tx.done;
	}

	async getBalance(): Promise<Budget | undefined> {
		const db = await this.dbPromise;
		const tx = db.transaction("balanceStore", "readonly");
		const value = await tx.store.get(DB.FIXED_BUDGET_KEY);
		await tx.done;
		return value;
	}

	async getTransactions(): Promise<Transaction[] | undefined> {
		const db = await this.dbPromise;
		const tx = db.transaction("transactionStore", "readonly");
		const value = await tx.store.get(DB.FIXED_TRANSACTIONS_KEY);
		await tx.done;
		return value;
	}

	async updateBalance(
		updater: (current: Budget | undefined) => Budget,
	): Promise<Budget> {
		const db = await this.dbPromise;
		const tx = db.transaction("balanceStore", "readwrite");
		const store = tx.objectStore("balanceStore");

		const current = await store.get(DB.FIXED_BUDGET_KEY);
		const updated = updater(current);
		await store.put(updated, DB.FIXED_BUDGET_KEY);

		await tx.done;
		return updated;
	}
}

export const db = new DB();
