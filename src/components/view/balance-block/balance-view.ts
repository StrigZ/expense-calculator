import { differenceInCalendarDays } from "date-fns";
import type { BalanceBlockRender } from "../../../types";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";

// TOOD: add type to imlement
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

	public render({ budgetPerDay, periodDate, budget }: BalanceBlockRender) {
		this.balancePerDayEl.textContent = budgetPerDay?.toString() ?? "";
		this.periodEl.textContent = periodDate
			? differenceInCalendarDays(periodDate, new Date()).toString()
			: "";
		this.totalBalanceEl.textContent = budget?.toString() ?? "";

		return this.element;
	}
}
