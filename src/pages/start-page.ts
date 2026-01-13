import { StartBlock } from "../components/blocks/start-block/start-block";
import { Component } from "../components/component";
import { Container } from "../components/container";
import type { StartPageConstructor } from "../types";

export class StartPage extends Component {
	private startBlock: StartBlock;
	constructor({ onSubmit }: StartPageConstructor) {
		super(new Container().render());

		this.startBlock = new StartBlock({ onSubmit });

		this.element.append(this.startBlock.render());
	}

	render() {
		return this.element;
	}
}
