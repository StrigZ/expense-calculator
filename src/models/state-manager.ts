import type {
	BalanceData,
	StateManager as TStateManager,
} from "../types/index";

export class StateManager implements TStateManager {
	private balanceData: BalanceData;
	constructor(defaultData: BalanceData) {
		this.balanceData = defaultData;
	}

	setBalanceData(data: BalanceData) {
		this.balanceData = data;
	}
	getBalanceData() {
		return this.balanceData;
	}
}
