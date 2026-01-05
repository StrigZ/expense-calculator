import { BalanceView } from "../components/view/balance-block/balance-view";
import { BalanceTodayView } from "../components/view/balance-today-block/balance-today-view";
import { Container } from "../components/view/container";
import { HistoryView } from "../components/view/history-block/history-view";
import { Page } from "../components/view/page";

export class HomePage extends Page {
	private balanceView: BalanceView;
	private balanceTodayView: BalanceTodayView;
	private historyView: HistoryView;
	constructor({
		handleNewExpense,
	}: { handleNewExpense: (expense: number) => void }) {
		const container = new Container({
			className: "flex w-full flex-col gap-6 md:max-w-xl md:gap-2",
		});
		super(container.render());

		this.balanceView = new BalanceView();
		this.balanceTodayView = new BalanceTodayView({ handleNewExpense });
		this.historyView = new HistoryView();
	}

	render({
		balancePerDay,
		period,
		totalBalance,
		averageSpentPerDay,
		history,
		availableBalance,
	}: {
		balancePerDay: number;
		period: number;
		totalBalance: number;
		availableBalance: number;
		// TODO: replace with real type when model is implemented
		history: { amount: number; date: Date }[];
		averageSpentPerDay: number;
	}) {
		this.element.append(
			this.balanceView.render({ balancePerDay, period, totalBalance }),
		);

		this.element.append(
			this.balanceTodayView.render({ availableBalance, balancePerDay }),
		);

		this.element.append(
			this.historyView.render({ history, averageSpentPerDay }),
		);

		return this.element;
	}

	dispose() {
		// remove all listeners
	}
}
