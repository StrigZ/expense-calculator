import { Page } from "../components/view/page";
import { StartBlock } from "../components/view/start-block/start-block";
import type { OnCalculateBudget } from "../types";

export class StartPage extends Page<DocumentFragment> {
	private StartBlock: StartBlock;
	constructor({
		onCalculateBudget,
	}: {
		onCalculateBudget: OnCalculateBudget;
	}) {
		super(new DocumentFragment());
		this.StartBlock = new StartBlock({ onCalculateBudget });
	}

	render() {
		this.element.append(this.StartBlock.render());

		return this.element;
	}
	dispose() {
		// remove all listeners
	}
}
