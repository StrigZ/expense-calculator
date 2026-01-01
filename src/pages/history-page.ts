import { BaseView } from "../components/view/base-view";
import { getTemplateById } from "../utils/utils";

export class HistoryPage extends BaseView {
	constructor() {
		const page = getTemplateById("history-page");

		super(page);
	}

	render() {
		// update page view
	}
}
