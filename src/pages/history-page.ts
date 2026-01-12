import { HistoryBlock } from "../components/blocks/history-block/history-block";
import { Container } from "../components/container";
import { Page } from "../components/page";
import type { HistoryPageConstructor, HistoryPageUpdate } from "../types";

export class HistoryPage extends Page {
	private historyBlock: HistoryBlock;
	constructor({ balanceData, goToHomePage }: HistoryPageConstructor) {
		super(new Container({}).render());

		this.historyBlock = new HistoryBlock({
			transactions: balanceData.transactions,
			onNavButtonClick: goToHomePage,
			navButtonText: "Вернуться",
		});
		this.element.append(this.historyBlock.render());
	}

	render() {
		return this.element;
	}

	update({ transactions, averageSpentPerDay }: HistoryPageUpdate) {
		this.historyBlock.update({ transactions, averageSpentPerDay });
	}
}
