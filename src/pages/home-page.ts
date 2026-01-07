import { BalanceBlock } from "../components/blocks/balance-block/balance-block.ts";
import { BalanceTodayBlock } from "../components/blocks/balance-today-block/balance-today-block.ts";
import { HistoryBlock } from "../components/blocks/history-block/history-block.ts";
import { Container } from "../components/container.ts";
import { Page } from "../components/page.ts";

import type { BalanceData, Transaction } from "../types";

export class HomePage extends Page {
	private balanceBlock: BalanceBlock;
	private balanceTodayBlock: BalanceTodayBlock;
	private historyBlock: HistoryBlock;
	constructor({
		handleNewTransaction,
	}: { handleNewTransaction: (transaction: Transaction) => void }) {
		const container = new Container({
			className: "flex w-full flex-col gap-6 md:gap-2",
		});
		super(container.render());

		this.balanceBlock = new BalanceBlock();
		this.balanceTodayBlock = new BalanceTodayBlock({ handleNewTransaction });
		this.historyBlock = new HistoryBlock();
	}

	render({
		budget,
		periodDate,
		budgetPerDay,
		transactions,
		availableBudgetToday,
		averageSpentPerDay,
	}: BalanceData) {
		this.element.append(
			this.balanceBlock.render({ budgetPerDay, periodDate, budget }),
		);

		this.element.append(
			this.balanceTodayBlock.render({ availableBudgetToday, budgetPerDay }),
		);

		this.element.append(
			this.historyBlock.render({ transactions, averageSpentPerDay }),
		);

		return this.element;
	}

	dispose() {
		// remove all listeners
	}
}
