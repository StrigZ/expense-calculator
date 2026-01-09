import { differenceInCalendarDays } from "date-fns";
import type { BalanceViewRender } from "../types";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../utils/utils";
import { Component } from "./component";

export class BalanceView extends Component {
	private static template: HTMLTemplateElement | null;

	private budgetEl: HTMLElement;
	private budgetPerDayEl: HTMLElement;
	private periodDateEl: HTMLElement;
	constructor() {
		if (!BalanceView.template) {
			BalanceView.template = getTemplateById("balance-view");
		}
		super(cloneTemplate(BalanceView.template));

		this.budgetEl = getElementByQuery("#balance-per-day", this.element);
		this.budgetPerDayEl = getElementByQuery("#total-balance", this.element);
		this.periodDateEl = getElementByQuery("#period", this.element);
	}

	render({ budget, budgetPerDay, periodDate }: BalanceViewRender) {
		this.budgetEl.textContent = budget.toString();
		this.budgetPerDayEl.textContent = budgetPerDay.toString();
		this.periodDateEl.textContent = differenceInCalendarDays(
			periodDate,
			new Date(),
		).toString();

		return this.element;
	}
}
