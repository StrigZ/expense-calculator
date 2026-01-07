import { HistoryBlock } from "../components/blocks/history-block/history-block";
import { Page } from "../components/page";
import type { HistoryBlockRender } from "../types";

export class HistoryPage extends Page<DocumentFragment> {
	private historyBlock: HistoryBlock;
	constructor() {
		super(new DocumentFragment());

		this.historyBlock = new HistoryBlock();
	}

	render({ transactions, averageSpentPerDay }: HistoryBlockRender) {
		this.element.append(
			this.historyBlock.render({ transactions, averageSpentPerDay }),
		);

		return this.element;
	}

	dispose(): void {
		// remove all listeners
	}
}
