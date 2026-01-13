import { TopupBlock } from "../components/blocks/topup-block/topup-block";
import { Component } from "../components/component";
import { Container } from "../components/container";
import type { TopupPageConstructor, TopupPageUpdate } from "../types";

export class TopupPage extends Component {
	private topupBlock: TopupBlock;
	constructor({ onSubmit }: TopupPageConstructor) {
		super(new Container().render());

		this.topupBlock = new TopupBlock({ onSubmit });
		this.element.append(this.topupBlock.render());
	}

	render() {
		return this.element;
	}

	update({ endDate, metrics }: TopupPageUpdate) {
		this.topupBlock.update({ endDate, metrics });
	}
}
