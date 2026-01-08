import { differenceInCalendarDays } from "date-fns";
import type { BalanceBlockRender, OnCalculateBudget } from "../../../types";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { BudgetForm } from "../../budget-form";
import { Component } from "../../component";

export class TopupBlock extends Component {
	private static template: HTMLTemplateElement | null;

	private balancePerDayEl: HTMLElement;
	private periodEl: HTMLElement;
	private totalBalanceEl: HTMLElement;
	private budgetForm: BudgetForm;
	constructor({
		onCalculateBudget,
	}: {
		onCalculateBudget: OnCalculateBudget;
	}) {
		if (!TopupBlock.template) {
			const template = getTemplateById("topup-block");
			TopupBlock.template = template;
		}

		super(cloneTemplate(TopupBlock.template));

		this.balancePerDayEl = getElementByQuery("#balance-per-day", this.element);
		this.periodEl = getElementByQuery("#period", this.element);
		this.totalBalanceEl = getElementByQuery("#total-balance", this.element);

		this.budgetForm = new BudgetForm({
			inputLabelText: "Пополнить",
			submitButtonText: "Сохранить",
			onCalculateBudget,
		});
		this.element.append(this.budgetForm.render());
	}

	render({ budgetPerDay, periodDate, budget }: BalanceBlockRender) {
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

		this.budgetForm.setPeriodDate(periodDate);
		this.budgetForm.setBudget(0);
		this.budgetForm.validateForm();

		return this.element;
	}
}
