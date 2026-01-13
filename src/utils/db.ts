import { type DBSchema, type IDBPDatabase, openDB } from "idb";
import type { Budget } from "../models/budget";
import type { Transaction } from "../models/transaction";

const FIXED_BUDGET_KEY = "current" as const;
const FIXED_TRANSACTIONS_KEY = "transactions" as const;

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
		await tx.store.put(data, FIXED_BUDGET_KEY);
		await tx.done;
	}

	async saveTransactions(transactions: Transaction[]): Promise<void> {
		const db = await this.dbPromise;
		const tx = db.transaction("transactionStore", "readwrite");
		await tx.store.put(transactions, FIXED_TRANSACTIONS_KEY);
		await tx.done;
	}

	async getBudget(): Promise<Budget | undefined> {
		const db = await this.dbPromise;
		const tx = db.transaction("balanceStore", "readonly");
		const value = await tx.store.get(FIXED_BUDGET_KEY);
		await tx.done;
		return value;
	}

	async getTransactions(): Promise<Transaction[] | undefined> {
		const db = await this.dbPromise;
		const tx = db.transaction("transactionStore", "readonly");
		const value = await tx.store.get(FIXED_TRANSACTIONS_KEY);
		await tx.done;
		return value;
	}
}

export const db = new DB();
