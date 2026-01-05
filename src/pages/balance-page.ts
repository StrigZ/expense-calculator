import { Page } from "../components/view/page";
import { getTemplateById } from "../utils/utils";

export class BalancePage extends Page {
	constructor() {
		const page = getTemplateById("balance-page");

		super(page);
	}

	render() {
		// update page view
	}

	dispose(): void {
		// remove all listeners
	}
}
