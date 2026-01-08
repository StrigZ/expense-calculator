import { StartBlock } from "../components/blocks/start-block/start-block";
import { Page } from "../components/page";
import type { OnCalculateBudget } from "../types";

export class StartPage extends Page<DocumentFragment> {
	private startBlock: StartBlock;
	constructor({
		onCalculateBudget,
	}: {
		onCalculateBudget: OnCalculateBudget;
	}) {
		super(new DocumentFragment());
		this.startBlock = new StartBlock({ onCalculateBudget });
	}

	render() {
		this.element.append(this.startBlock.render());

		return this.element;
	}
	dispose() {
		// remove all listeners
	}
}
