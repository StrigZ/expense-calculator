import { HistoryBlock } from "../components/blocks/history-block/history-block";
import { Container } from "../components/container";
import { Page } from "../components/page";
import type { HistoryPageUpdate } from "../types";

export class HistoryPage extends Page {
	private historyBlock: HistoryBlock;
	constructor({ goToHomePage }: { goToHomePage: () => void }) {
		super(new Container({}).render());

		this.historyBlock = new HistoryBlock({
			onNavButtonClick: goToHomePage,
			navButtonText: "Вернуться",
			shouldShowFullHistory: true,
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
