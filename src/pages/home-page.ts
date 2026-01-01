import { BaseView } from "../components/view/base-view";
import { HistoryView } from "../components/view/history-view";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../utils/utils";

export class HomePage extends BaseView {
	public static template: HTMLTemplateElement | null;

	private perDayBalance: Element;
	private total: Element;
	private period: Element;
	private availableToday: Element;
	private perDayBody: Element;

	private historyView: HistoryView;
	constructor() {
		if (!HomePage.template) {
			const template = getTemplateById("home-page");
			HomePage.template = template;
		}

		const page = cloneTemplate(HomePage.template);
		super(page);

		const perDayBalance = getElementByQuery("#balance-card #per-day", page);
		const total = getElementByQuery("#total", page);
		const period = getElementByQuery("#period", page);
		const availableToday = getElementByQuery("#available-today", page);
		const perDayBody = getElementByQuery("#today-card #per-day", page);

		this.perDayBalance = perDayBalance;
		this.total = total;
		this.period = period;
		this.availableToday = availableToday;
		this.perDayBody = perDayBody;

		this.historyView = new HistoryView();
	}

	render({
		availableToday,
		averageSpentPerDay,
		total,
		history,
		perDay,
		period,
	}: {
		total: number;
		period: number;
		perDay: number;
		availableToday: number;
		// TODO: replace with real type when model is implemented
		history: { amount: number; date: Date }[];
		averageSpentPerDay: number;
	}) {
		this.total.textContent = total.toString();
		this.period.textContent = `на ${period} дней`;
		this.availableToday.textContent = availableToday.toString();
		this.perDayBalance.textContent = `${perDay} ₽ в день`;
		this.perDayBody.textContent = `/ ${perDay}`;

		this.historyView.render({ history, averageSpentPerDay });
		this.element.append(this.historyView.getElement());
	}
}
