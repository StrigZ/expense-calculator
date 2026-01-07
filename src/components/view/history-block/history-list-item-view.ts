import { format } from "date-fns";
import type { Transaction } from "../../../types";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";

export class HistoryListItemView extends Component {
	private static template: HTMLTemplateElement | null;

	private spentAmountEl: HTMLElement;
	private transactionDateEl: HTMLElement;
	constructor() {
		if (!HistoryListItemView.template) {
			HistoryListItemView.template = getTemplateById("history-list-item");
		}

		super(cloneTemplate(HistoryListItemView.template));

		this.spentAmountEl = getElementByQuery("#spent-amount", this.element);
		this.transactionDateEl = getElementByQuery("#spent-date", this.element);
	}

	render({
		amount,
		date,
	}: {
		amount: Transaction["amount"];
		date: Transaction["date"];
	}) {
		this.spentAmountEl.textContent = amount.toString();
		this.transactionDateEl.textContent = format(date, "d MMMM");

		return this.element;
	}
}
