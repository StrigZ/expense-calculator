import { BalanceView } from "../components/view/balance-block/balance-view";
import { BalanceTodayView } from "../components/view/balance-today-block/balance-today-view";
import { BaseView } from "../components/view/base-view";
import { HistoryView } from "../components/view/history-block/history-view";
import { cloneTemplate, getTemplateById } from "../utils/utils";

export class HomePage extends BaseView {
	public static template: HTMLTemplateElement | null;

	private balanceView: BalanceView;
	private balanceTodayView: BalanceTodayView;
	private historyView: HistoryView;
	constructor({
		handleNewExpense,
	}: { handleNewExpense: (expense: number) => void }) {
		if (!HomePage.template) {
			const template = getTemplateById("home-page");
			HomePage.template = template;
		}

		const page = cloneTemplate(HomePage.template);
		super(page);

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
		this.balanceView.render({ balancePerDay, period, totalBalance });
		this.element.append(this.balanceView.getElement());

		this.balanceTodayView.render({ availableBalance, balancePerDay });
		this.element.append(this.balanceTodayView.getElement());

		this.historyView.render({ history, averageSpentPerDay });
		this.element.append(this.historyView.getElement());
	}
}
