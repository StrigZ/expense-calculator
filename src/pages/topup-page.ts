import { TopupBlock } from "../components/blocks/topup-block/topup-block";
import { Component } from "../components/component";
import { Container } from "../components/container";
import type { TopupPageConstructor, TopupPageUpdate } from "../types";

export class TopupPage extends Component {
	private topupBlock: TopupBlock;
	constructor({ onSubmit }: TopupPageConstructor) {
		super(
			new Container({
				className:
					"flex w-full flex-col justify-center items-center gap-6 md:gap-2",
			}).render(),
		);

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
