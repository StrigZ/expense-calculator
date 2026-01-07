import { BalanceView } from "../components/view/balance-block/balance-view";
import { BalanceTodayView } from "../components/view/balance-today-block/balance-today-view";
import { Container } from "../components/view/container";
import { HistoryView } from "../components/view/history-block/history-view";
import { Page } from "../components/view/page";
import type { BalanceData, Transaction } from "../types";

export class HomePage extends Page {
	private balanceView: BalanceView;
	private balanceTodayView: BalanceTodayView;
	private historyView: HistoryView;
	constructor({
		handleNewTransaction,
	}: { handleNewTransaction: (transaction: Transaction) => void }) {
		const container = new Container({
			className: "flex w-full flex-col gap-6 md:gap-2",
		});
		super(container.render());

		this.balanceView = new BalanceView();
		this.balanceTodayView = new BalanceTodayView({ handleNewTransaction });
		this.historyView = new HistoryView();
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
			this.balanceTodayView.render({ availableBudgetToday, budgetPerDay }),
		);

		this.element.append(
			this.historyView.render({ transactions, averageSpentPerDay }),
		);

		return this.element;
	}

	dispose() {
		// remove all listeners
	}
}
