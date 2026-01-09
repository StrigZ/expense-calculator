import { TopupBlock } from "../components/blocks/topup-block/topup-block";
import { Container } from "../components/container";
import { Page } from "../components/page";
import type { BalanceData, OnCalculateBudget } from "../types";

export class TopupPage extends Page {
	private topupBlock: TopupBlock;
	constructor({
		onCalculateBudget,
	}: {
		onCalculateBudget: OnCalculateBudget;
	}) {
		super(new Container({}).render());

		this.topupBlock = new TopupBlock({ onCalculateBudget });
		this.element.append(this.topupBlock.render());
	}

	render() {
		return this.element;
	}

	update(balanceData: BalanceData) {
		this.topupBlock.update(balanceData);
	}
}
