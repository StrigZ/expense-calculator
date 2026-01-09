import type { HistoryBlockRender } from "../../../types";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../../component";
import { HistoryListItemView } from "./history-list-item-view";

export class HistoryBlock extends Component {
	private static template: HTMLTemplateElement | null;

	private historyList: HTMLElement;
	private averageSpentPerDay: HTMLElement;
	private navButton: HTMLButtonElement;

	constructor({
		onNavButtonClick,
		navButtonText,
	}: { onNavButtonClick: () => void; navButtonText: string }) {
		if (!HistoryBlock.template) {
			HistoryBlock.template = getTemplateById("history-block");
		}

		super(cloneTemplate(HistoryBlock.template));

		this.historyList = getElementByQuery("#history-list", this.element);
		this.averageSpentPerDay = getElementByQuery(
			"#average-spent-per-day",
			this.element,
		);

		this.navButton = getElementByQuery("#nav-button", this.element);

		this.navButton.addEventListener("click", onNavButtonClick);
		this.navButton.textContent = navButtonText;
	}

	render(): HTMLElement {
		return this.element;
	}

	update({ transactions, averageSpentPerDay }: HistoryBlockRender) {
		const fragment = new DocumentFragment();
		transactions.forEach((transaction) => {
			const newHistoryItem = new HistoryListItemView(transaction);
			fragment.append(newHistoryItem.render());
		});
		this.historyList.replaceChildren(fragment);

		this.averageSpentPerDay.textContent = averageSpentPerDay?.toString() ?? "0";
	}
}
