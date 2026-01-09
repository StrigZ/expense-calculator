import { format } from "date-fns";
import type { Transaction } from "../../../types";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../../component";

export class HistoryListItemView extends Component {
	private static template: HTMLTemplateElement | null;

	constructor({ amount, date }: Transaction) {
		if (!HistoryListItemView.template) {
			HistoryListItemView.template = getTemplateById("history-list-item");
		}

		super(cloneTemplate(HistoryListItemView.template));

		const spentAmountEl = getElementByQuery("#spent-amount", this.element);
		const transactionDateEl = getElementByQuery("#spent-date", this.element);

		spentAmountEl.textContent = amount.toString();
		transactionDateEl.textContent = format(date, "d MMMM");
	}

	render() {
		return this.element;
	}
}
