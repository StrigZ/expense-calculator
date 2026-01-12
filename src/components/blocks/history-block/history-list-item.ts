import { format } from "date-fns";
import type { Transaction } from "../../../types";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../../component";

export class HistoryListItem extends Component {
	private static template: HTMLTemplateElement | null;

	constructor({ amount, date }: Transaction) {
		if (!HistoryListItem.template) {
			HistoryListItem.template = getTemplateById("history-list-item");
		}

		super(cloneTemplate(HistoryListItem.template));

		const spentAmountEl = getElementByQuery("#spent-amount", this.element);
		const transactionDateEl = getElementByQuery("#spent-date", this.element);

		spentAmountEl.textContent = amount.toString();
		transactionDateEl.textContent = format(date, "d MMMM");
	}

	render() {
		return this.element;
	}
}
