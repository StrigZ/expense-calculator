import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";
import { HistoryListItemView } from "./history-list-item-view";

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

	// TODO: replace with real type when history model is implemented
	public render({
		history,
		averageSpentPerDay,
	}: {
		history: { amount: number; date: Date }[];
		averageSpentPerDay: number;
	}) {
		this.historyList.innerHTML = "";
		history.forEach((data) => {
			const newHistoryItem = new HistoryListItemView();
			this.historyList.append(newHistoryItem.render(data));
		});

		this.averageSpentPerDay.textContent = averageSpentPerDay.toString();

		return this.element;
	}
}
