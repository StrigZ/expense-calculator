import { BaseView } from "../components/view/base-view";
import { getTemplateById } from "../utils/utils";

export class BalancePage extends BaseView {
	constructor() {
		const page = getTemplateById("balance-page");

		super(page);
	}

	render() {
		// update page view
	}
}
