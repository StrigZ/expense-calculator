import { format } from "date-fns";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { BaseView } from "../base-view";

export class HistoryListItemView extends BaseView {
	private static template: HTMLTemplateElement | null;

	private amountEl: HTMLElement;
	private dateEl: HTMLElement;
	constructor() {
		if (!HistoryListItemView.template) {
			const template = getTemplateById("history-list-item");
			HistoryListItemView.template = template;
		}

		const historyListItem = cloneTemplate(HistoryListItemView.template);
		super(historyListItem);

		this.amountEl = getElementByQuery("#spent-amount", historyListItem);
		this.dateEl = getElementByQuery("#spent-date", historyListItem);
	}

	render({ amount, date }: { amount: number; date: Date }) {
		this.amountEl.textContent = amount.toString();
		this.dateEl.textContent = format(date, "do MMMM");
	}
}
