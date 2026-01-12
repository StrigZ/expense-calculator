import { type DBSchema, type IDBPDatabase, openDB } from "idb";
import type { BalanceData } from "../types";

interface BudgetDBSchema extends DBSchema {
	balanceStore: {
		key: "current";
		value: BalanceData;
	};
}

export class DB {
	private dbPromise: Promise<IDBPDatabase<BudgetDBSchema>>;
	private static readonly FIXED_KEY = "current" as const;

	constructor() {
		this.dbPromise = openDB<BudgetDBSchema>("budget-db", 1, {
			upgrade(db) {
				db.createObjectStore("balanceStore");
			},
		});
	}

	async getBalance(): Promise<BalanceData | undefined> {
		const db = await this.dbPromise;
		const tx = db.transaction("balanceStore", "readonly");
		const value = await tx.store.get(DB.FIXED_KEY);
		await tx.done;
		return value;
	}

	async saveBalance(data: BalanceData): Promise<void> {
		const db = await this.dbPromise;
		const tx = db.transaction("balanceStore", "readwrite");
		await tx.store.put(data, DB.FIXED_KEY);
		await tx.done;
	}

	async updateBalance(
		updater: (current: BalanceData | undefined) => BalanceData,
	): Promise<BalanceData> {
		const db = await this.dbPromise;
		const tx = db.transaction("balanceStore", "readwrite");
		const store = tx.objectStore("balanceStore");

		const current = await store.get(DB.FIXED_KEY);
		const updated = updater(current);
		await store.put(updated, DB.FIXED_KEY);

		await tx.done;
		return updated;
	}
}
