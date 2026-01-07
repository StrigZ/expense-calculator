import { differenceInCalendarDays } from "date-fns";
import type { BalanceBlockRender } from "../../../types";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../../component";

// TOOD: add type to imlement
export class BalanceBlock extends Component {
	private static template: HTMLTemplateElement | null;

	private balancePerDayEl: HTMLElement;
	private periodEl: HTMLElement;
	private totalBalanceEl: HTMLElement;
	constructor() {
		if (!BalanceBlock.template) {
			BalanceBlock.template = getTemplateById("balance-block");
		}

		super(cloneTemplate(BalanceBlock.template));

		this.balancePerDayEl = getElementByQuery("#balance-per-day", this.element);
		this.periodEl = getElementByQuery("#period", this.element);
		this.totalBalanceEl = getElementByQuery("#total-balance", this.element);
	}

	public render({ budgetPerDay, periodDate, budget }: BalanceBlockRender) {
		if (budgetPerDay === null || budget === null || !periodDate) {
			throw new Error(
				"BalanceBlock: budgetPerDay or budget or periodDate is null",
			);
		}

		this.balancePerDayEl.textContent = budgetPerDay.toString();
		this.periodEl.textContent = differenceInCalendarDays(
			periodDate,
			new Date(),
		).toString();
		this.totalBalanceEl.textContent = budget.toString();

		return this.element;
	}
}
