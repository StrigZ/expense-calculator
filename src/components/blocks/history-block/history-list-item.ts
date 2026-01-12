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

	constructor({
		amount,
		date,
		id,
		isDeleteButtonVisible,
	}: Transaction & { isDeleteButtonVisible: boolean }) {
		if (!HistoryListItem.template) {
			HistoryListItem.template = getTemplateById("history-list-item");
		}

		super(cloneTemplate(HistoryListItem.template));

		const spentAmountEl = getElementByQuery("#spent-amount", this.element);
		const transactionDateEl = getElementByQuery("#spent-date", this.element);
		const deleteButton = getElementByQuery(
			"#delete-transaction-btn",
			this.element,
		);

		spentAmountEl.textContent = amount.toString();
		transactionDateEl.textContent = format(date, "d MMMM");
		deleteButton.classList.toggle("hidden", !isDeleteButtonVisible);

		this.element.dataset.id = id;
	}

	render() {
		return this.element;
	}
}
