import { BalanceBlock } from "../components/blocks/balance-block/balance-block.ts";
import { BalanceTodayBlock } from "../components/blocks/balance-today-block/balance-today-block.ts";
import { HistoryBlock } from "../components/blocks/history-block/history-block.ts";
import { Container } from "../components/container.ts";
import { Page } from "../components/page.ts";

import type { HomePageUpdate, Transaction } from "../types";

export class HomePage extends Page {
	private balanceBlock: BalanceBlock;
	private balanceTodayBlock: BalanceTodayBlock;
	private historyBlock: HistoryBlock;
	constructor({
		handleNewTransaction,
		goToHistoryPage,
		goToTopupPage,
	}: {
		handleNewTransaction: (transaction: Transaction) => void;
		goToHistoryPage: () => void;
		goToHomePage: () => void;
		goToTopupPage: () => void;
	}) {
		const container = new Container({
			className: "flex w-full flex-col gap-6 md:gap-2",
		});
		super(container.render());

		this.balanceBlock = new BalanceBlock({ goToHistoryPage, goToTopupPage });
		this.balanceTodayBlock = new BalanceTodayBlock({ handleNewTransaction });
		this.historyBlock = new HistoryBlock({
			onNavButtonClick: goToHistoryPage,
			navButtonText: "Смотреть всю историю",
			shouldShowFullHistory: false,
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

	update({
		budget,
		periodDate,
		budgetPerDay,
		transactions,
		availableBudgetToday,
		averageSpentPerDay,
	}: HomePageUpdate) {
		if (
			budgetPerDay === null ||
			budget === null ||
			availableBudgetToday === null ||
			averageSpentPerDay === null ||
			!periodDate
		) {
			throw new Error("HomePage: update data is empty!");
		}

		this.balanceBlock.update({ budgetPerDay, periodDate, budget });
		this.balanceTodayBlock.update({ availableBudgetToday, budgetPerDay });
		this.historyBlock.update({ transactions, averageSpentPerDay });
	}
}
