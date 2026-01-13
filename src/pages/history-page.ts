import { HistoryBlock } from "../components/blocks/history-block/history-block";
import { Component } from "../components/component";
import { Container } from "../components/container";
import type { HistoryPageConstructor, HistoryPageUpdate } from "../types";

export class HistoryPage extends Component {
	private historyBlock: HistoryBlock;
	constructor({
		transactions,
		goToHomePage,
		handleTransactionDelete,
	}: HistoryPageConstructor) {
		super(new Container().render());

		this.historyBlock = new HistoryBlock({
			transactions,
			navButtonText: "Вернуться",
			canDeleteTransactions: true,
			onNavButtonClick: goToHomePage,
			handleTransactionDelete,
		});
		this.element.append(this.historyBlock.render());
	}

	render() {
		return this.element;
	}

	update({ transactions, metrics }: HistoryPageUpdate) {
		this.historyBlock.update({ transactions, metrics });
	}
}
