import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";

export class BalanceView extends Component {
	private static template: HTMLTemplateElement | null;

	private balancePerDayEl: HTMLElement;
	private periodEl: HTMLElement;
	private totalBalanceEl: HTMLElement;
	constructor() {
		if (!BalanceView.template) {
			const template = getTemplateById("balance-block");
			BalanceView.template = template;
		}

		const balanceBlock = cloneTemplate(BalanceView.template);
		super(balanceBlock);

		this.balancePerDayEl = getElementByQuery("#balance-per-day", balanceBlock);
		this.periodEl = getElementByQuery("#period", balanceBlock);
		this.totalBalanceEl = getElementByQuery("#total-balance", balanceBlock);
	}

	public render({
		balancePerDay,
		period,
		totalBalance,
	}: {
		totalBalance: number;
		period: number;
		balancePerDay: number;
	}) {
		this.balancePerDayEl.textContent = balancePerDay.toString();
		this.periodEl.textContent = period.toString();
		this.totalBalanceEl.textContent = totalBalance.toString();

		return this.element;
	}
}
