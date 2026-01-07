import { TopupBlock } from "../components/blocks/topup-block/topup-block";
import { Page } from "../components/page";
import type { BalanceBlockRender, OnCalculateBudget } from "../types";

export class TopupPage extends Page<DocumentFragment> {
	private topupBlock: TopupBlock;
	constructor({
		onCalculateBudget,
	}: {
		onCalculateBudget: OnCalculateBudget;
	}) {
		super(new DocumentFragment());

		this.topupBlock = new TopupBlock({ onCalculateBudget });
	}

	render({ budget, budgetPerDay, periodDate }: BalanceBlockRender) {
		// update page view
		this.element.append(
			this.topupBlock.render({ budget, budgetPerDay, periodDate }),
		);

		return this.element;
	}

	dispose(): void {
		// remove all listeners
	}
}
