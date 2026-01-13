import { TopupBlock } from "../components/blocks/topup-block/topup-block";
import { Component } from "../components/component";
import { Container } from "../components/container";
import type { BalanceData, TopupPageConstructor } from "../types";

export class TopupPage extends Component {
	private topupBlock: TopupBlock;
	constructor({ onCalculateBudget }: TopupPageConstructor) {
		super(new Container().render());

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
