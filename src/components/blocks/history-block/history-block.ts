import type { HistoryBlockUpdate } from "../../../types";
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
	private shouldShowFullHistory: boolean;
	constructor({
		onNavButtonClick,
		navButtonText,
		shouldShowFullHistory,
	}: {
		onNavButtonClick: () => void;
		navButtonText: string;
		shouldShowFullHistory: boolean;
	}) {
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
		this.navButton.classList.add("hidden");

		this.shouldShowFullHistory = shouldShowFullHistory;
	}

	render(): HTMLElement {
		return this.element;
	}

	update({ transactions, averageSpentPerDay }: HistoryBlockUpdate) {
		if (averageSpentPerDay === null) {
			throw new Error("HistoryBlock: update data is empty!");
		}

		const visibleTransactions = this.shouldShowFullHistory
			? transactions
			: transactions.slice(0, 3);

		const fragment = new DocumentFragment();
		visibleTransactions.forEach((transaction) => {
			const newHistoryItem = new HistoryListItemView(transaction);
			fragment.append(newHistoryItem.render());
		});
		this.historyList.replaceChildren(fragment);

		this.averageSpentPerDay.textContent = averageSpentPerDay.toString();

		this.navButton.classList.toggle("hidden", transactions.length <= 3);
	}
}
