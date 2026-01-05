import { Page } from "../components/view/page";
import { StartView } from "../components/view/start-block/start-view";

export class StartPage extends Page<DocumentFragment> {
	private startView: StartView;
	constructor() {
		super(new DocumentFragment());
		this.startView = new StartView();
	}

	render() {
		this.element.append(this.startView.render());

		return this.element;
	}
	dispose(): void {
		// remove all listeners
	}
}
