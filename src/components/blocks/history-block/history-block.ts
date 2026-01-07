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

	constructor() {
		if (!HistoryBlock.template) {
			HistoryBlock.template = getTemplateById("history-block");
		}

		super(cloneTemplate(HistoryBlock.template));

		this.historyList = getElementByQuery("#history-list", this.element);
		this.averageSpentPerDay = getElementByQuery(
			"#average-spent-per-day",
			this.element,
		);
	}

	public render({
		transactions,
		averageSpentPerDay,
	}: HistoryBlockRender): HTMLElement {
		const fragment = new DocumentFragment();
		transactions.forEach((transaction) => {
			const newHistoryItem = new HistoryListItemView();
			fragment.append(newHistoryItem.render(transaction));
		});
		this.historyList.replaceChildren(fragment);

		this.averageSpentPerDay.textContent = averageSpentPerDay?.toString() ?? "0";

		return this.element;
	}
}
