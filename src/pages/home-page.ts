import { BalanceView } from "../components/view/balance-block/balance-view";
import { BaseView } from "../components/view/base-view";
import { HistoryView } from "../components/view/history-block/history-view";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../utils/utils";

export class HomePage extends BaseView {
	public static template: HTMLTemplateElement | null;

	private perDayBody: Element;

	private historyView: HistoryView;
	private balanceView: BalanceView;
	constructor() {
		if (!HomePage.template) {
			const template = getTemplateById("home-page");
			HomePage.template = template;
		}

		const page = cloneTemplate(HomePage.template);
		super(page);

		const perDayBody = getElementByQuery("#today-card #per-day", page);

		this.perDayBody = perDayBody;

		this.historyView = new HistoryView();
		this.balanceView = new BalanceView();
	}

	render({
		balancePerDay,
		period,
		totalBalance,
		averageSpentPerDay,
		history,
	}: {
		balancePerDay: number;
		period: number;
		totalBalance: number;

		availableToday: number;

		// TODO: replace with real type when model is implemented
		history: { amount: number; date: Date }[];
		averageSpentPerDay: number;
	}) {
		this.perDayBody.textContent = `/ ${balancePerDay}`;

		this.balanceView.render({ balancePerDay, period, totalBalance });
		this.element.append(this.balanceView.getElement());

		this.historyView.render({ history, averageSpentPerDay });
		this.element.append(this.historyView.getElement());
	}
}
