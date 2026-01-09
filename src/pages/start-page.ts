import { StartBlock } from "../components/blocks/start-block/start-block";
import { Container } from "../components/container";
import { Page } from "../components/page";
import type { OnCalculateBudget } from "../types";

export class StartPage extends Page {
	private startBlock: StartBlock;
	constructor({
		onCalculateBudget,
	}: {
		onCalculateBudget: OnCalculateBudget;
	}) {
		super(new Container({}).render());

		this.startBlock = new StartBlock({ onCalculateBudget });

		this.element.append(this.startBlock.render());
	}

	render() {
		return this.element;
	}
}
