import { BalanceBlock } from "../components/blocks/balance-block/balance-block.ts";
import { BalanceTodayBlock } from "../components/blocks/balance-today-block/balance-today-block.ts";
import { HistoryBlock } from "../components/blocks/history-block/history-block.ts";
import { Component } from "../components/component.ts";
import { Container } from "../components/container.ts";

import type { HomePageConstructor, HomePageUpdate } from "../types";

export class HomePage extends Component {
	private balanceBlock: BalanceBlock;
	private balanceTodayBlock: BalanceTodayBlock;
	private historyBlock: HistoryBlock;
	constructor({
		transactions,
		handleNewTransaction,
		goToHistoryPage,
		goToTopupPage,
	}: HomePageConstructor) {
		const container = new Container({
			className:
				"flex w-full flex-col justify-center items-center gap-6 md:gap-2",
		});
		super(container.render());

		this.balanceBlock = new BalanceBlock({ goToHistoryPage, goToTopupPage });
		this.balanceTodayBlock = new BalanceTodayBlock({ handleNewTransaction });
		this.historyBlock = new HistoryBlock({
			transactions: transactions,
			navButtonText: "Смотреть всю историю",
			canDeleteTransactions: false,
			onNavButtonClick: goToHistoryPage,
		});

		this.element.append(
			this.balanceBlock.render(),
			this.balanceTodayBlock.render(),
			this.historyBlock.render(),
		);
	}

	render() {
		return this.element;
	}

	update({ transactions, metrics }: HomePageUpdate) {
		this.balanceBlock.update(metrics);
		this.balanceTodayBlock.update(metrics);

		const visibleTransactions = transactions.slice(0, 3);
		this.historyBlock.update({
			transactions: visibleTransactions,
			metrics,
		});
	}
}
