import { Page } from "../components/view/page";
import { StartBlock } from "../components/view/start-block/start-block";

export class StartPage extends Page<DocumentFragment> {
	private StartBlock: StartBlock;
	constructor() {
		super(new DocumentFragment());
		this.StartBlock = new StartBlock();
	}

	render() {
		this.element.append(this.StartBlock.render());

		return this.element;
	}
	dispose() {
		// remove all listeners
	}
}
