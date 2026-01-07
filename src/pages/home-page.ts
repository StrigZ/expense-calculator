import { BalanceView } from "../components/blocks/balance-block/balance-view.ts";
import { BalanceTodayBlock } from "../components/blocks/balance-today-block/balance-today-block.ts";
import { Container } from "../components/container.ts";
import { Page } from "../components/page.ts";
import { HistoryBlock } from "../components/view/history-block/history-block.ts";
import type { BalanceData, Transaction } from "../types";

export class HomePage extends Page {
	private balanceView: BalanceView;
	private balanceTodayBlock: BalanceTodayBlock;
	private historyBlock: HistoryBlock;
	constructor({
		handleNewTransaction,
	}: { handleNewTransaction: (transaction: Transaction) => void }) {
		const container = new Container({
			className: "flex w-full flex-col gap-6 md:gap-2",
		});
		super(container.render());

		this.balanceView = new BalanceView();
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
			this.balanceView.render({ budgetPerDay, periodDate, budget }),
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
