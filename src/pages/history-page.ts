import { Page } from "../components/page";
import { getTemplateById } from "../utils/utils";

export class HistoryPage extends Page {
	constructor() {
		const page = getTemplateById("history-page");

		super(page);
	}

	render() {
		return this.element;
	}

	dispose(): void {
		// remove all listeners
	}
}
