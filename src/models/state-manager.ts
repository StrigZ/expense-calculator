import type {
	BalanceData,
	StateManager as TStateManager,
} from "../types/index";
import { db } from "../utils/db";

export class StateManager implements TStateManager {
	private balanceData: BalanceData;
	constructor(defaultData: BalanceData) {
		this.balanceData = defaultData;
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
