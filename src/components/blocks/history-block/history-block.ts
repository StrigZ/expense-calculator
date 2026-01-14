import { compareDesc } from "date-fns";
import type {
	HistoryBlockConstructor,
	HistoryBlockUpdate,
} from "../../../types";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Button } from "../../button";
import { Component } from "../../component";
import { HistoryList } from "./history-list";
import { HistoryListItem } from "./history-list-item";

export class HistoryBlock extends Component {
	private static template: HTMLTemplateElement | null;

	private historyList: HistoryList;
	private averageSpentPerDay: HTMLElement;
	private navButton: Button;
	private canDeleteTransactions: boolean;
	constructor({
		transactions,
		navButtonText,
		canDeleteTransactions,
		onNavButtonClick,
		handleTransactionDelete,
	}: HistoryBlockConstructor) {
		if (!HistoryBlock.template) {
			HistoryBlock.template = getTemplateById("history-block");
		}

		super(cloneTemplate(HistoryBlock.template));

		this.historyList = new HistoryList({
			items: transactions
				.sort((a, b) => compareDesc(a.date, b.date))
				.map(
					(transaction) =>
						new HistoryListItem({
							isDeleteButtonVisible: canDeleteTransactions,
							...transaction,
						}),
				),
			onTransactionDelete: handleTransactionDelete,
		});

		this.averageSpentPerDay = getElementByQuery(
			"#average-spent-per-day",
			this.element,
		);

		this.navButton = new Button({
			text: navButtonText,
			className: "hidden",
			variant: "outline",
			onClick: onNavButtonClick,
		});

		this.canDeleteTransactions = canDeleteTransactions;

		this.element.append(this.historyList.render(), this.navButton.render());
	}

	render(): HTMLElement {
		return this.element;
	}

	update({ transactions, metrics }: HistoryBlockUpdate) {
		this.historyList.update(
			transactions
				.sort((a, b) => compareDesc(a.date, b.date))
				.map(
					(transaction) =>
						new HistoryListItem({
							isDeleteButtonVisible: this.canDeleteTransactions,
							...transaction,
						}),
				),
		);

		this.averageSpentPerDay.textContent = metrics.avgSpentPerDay.toString();
		this.navButton.setIsButtonHidden(
			!this.canDeleteTransactions && transactions.length < 1,
		);
	}
}
