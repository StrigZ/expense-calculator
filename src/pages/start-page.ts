import { Page } from "../components/view/page";
import { StartView } from "../components/view/start-block/start-view";

export class StartPage extends Page {
	private startView: StartView;
	constructor() {
		super();
		this.startView = new StartView();
	}

	render() {
		this.startView.render();
		this.element.append(this.startView.getElement());
	}
	dispose(): void {
		// remove all listeners
	}
}
