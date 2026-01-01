import { BaseView } from "../components/view/base-view";
import { StartView } from "../components/view/start-block/start-view";

export class StartPage extends BaseView {
	private startView: StartView;
	constructor() {
		super();

		this.startView = new StartView();
	}

	render() {
		this.startView.render();
		this.element.append(this.startView.getElement());
	}
}
