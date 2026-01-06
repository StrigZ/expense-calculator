import type { HistoryBlockRender } from "../../../types";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";
import { HistoryListItemView } from "./history-list-item-view";

// TOOD: add type to imlement
export class HistoryView extends Component {
	private static template: HTMLTemplateElement | null;

	private historyList: HTMLElement;
	private averageSpentPerDay: HTMLElement;

	constructor() {
		if (!HistoryView.template) {
			const template = getTemplateById("history-block");
			HistoryView.template = template;
		}

		const historyBlock = cloneTemplate(HistoryView.template);
		super(historyBlock);

		const historyList = getElementByQuery("#history-list", historyBlock);
		const averageSpentPerDay = getElementByQuery(
			"#average-spent-per-day",
			historyBlock,
		);

		this.historyList = historyList;
		this.averageSpentPerDay = averageSpentPerDay;
	}

	public render({ transactions, averageSpentPerDay }: HistoryBlockRender) {
		// TODO: use fragment and replacechildren
		this.historyList.innerHTML = "";
		transactions.forEach((transaction) => {
			const newHistoryItem = new HistoryListItemView();
			this.historyList.append(newHistoryItem.render(transaction));
		});

		this.averageSpentPerDay.textContent = averageSpentPerDay?.toString() ?? "";

		return this.element;
	}
}
