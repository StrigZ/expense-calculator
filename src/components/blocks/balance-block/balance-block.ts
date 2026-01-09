import type { BalanceViewRender } from "../../../types";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { BalanceView } from "../../balance-view";
import { Component } from "../../component";

export class BalanceBlock extends Component {
	private static template: HTMLTemplateElement | null;

	private balanceView: BalanceView;
	constructor({
		goToHistoryPage,
		goToTopupPage,
	}: {
		goToTopupPage: () => void;
		goToHistoryPage: () => void;
	}) {
		if (!BalanceBlock.template) {
			BalanceBlock.template = getTemplateById("balance-block");
		}

		super(cloneTemplate(BalanceBlock.template));

		this.balanceView = new BalanceView();

		const goToTopupPageButton = getElementByQuery(
			"#go-to-topup-page",
			this.element,
		);
		const goToHistoryPageButton = getElementByQuery(
			"#go-to-history-page",
			this.element,
		);

		goToTopupPageButton.addEventListener("click", goToTopupPage);
		goToHistoryPageButton.addEventListener("click", goToHistoryPage);

		this.element.prepend(this.balanceView.render());
	}

	render() {
		return this.element;
	}

	update(balanceViewData: BalanceViewRender) {
		this.balanceView.update(balanceViewData);
	}
}
