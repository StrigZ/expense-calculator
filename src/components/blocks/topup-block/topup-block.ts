import type { BalanceData, TopupBlockConstructor } from "../../../types";

import { BalanceView } from "../../balance-view";
import { BudgetForm } from "../../budget-form";
import { Component } from "../../component";
import { Container } from "../../container";

export class TopupBlock extends Component {
	private balanceView: BalanceView;
	private budgetForm: BudgetForm;
	constructor({ onCalculateBudget }: TopupBlockConstructor) {
		const container = new Container({ className: "card flex flex-col" });

		super(container.render());

		this.balanceView = new BalanceView();

		this.budgetForm = new BudgetForm({
			inputLabelText: "Пополнить",
			submitButtonText: "Сохранить",
			onCalculateBudget,
		});
		this.budgetForm.setBudget(0);

		this.element.append(this.balanceView.render(), this.budgetForm.render());
	}

	render() {
		return this.element;
	}

	update({ budgetPerDay, periodDate, budget }: BalanceData) {
		if (budgetPerDay === null || budget === null || !periodDate) {
			throw new Error("BalanceBlock: update data is empty!");
		}

		this.balanceView.update({ budget, budgetPerDay, periodDate });

		this.budgetForm.setPeriodDate(periodDate);
		this.budgetForm.update();

		return this.element;
	}
}
