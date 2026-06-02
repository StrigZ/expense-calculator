import type { TopupBlockConstructor, TopupBlockUpdate } from "../../../types";

import { BalanceView } from "../../balance-view";
import { BudgetForm } from "../../budget-form";
import { Component } from "../../component";
import { Container } from "../../container";

export class TopupBlock extends Component {
	private balanceView: BalanceView;
	private budgetForm: BudgetForm;
	constructor({ onSubmit }: TopupBlockConstructor) {
		const container = new Container({ className: "card flex flex-col" });

		super(container.render());

		this.balanceView = new BalanceView();

		this.budgetForm = new BudgetForm({
			inputLabelText: "Пополнить",
			submitButtonText: "Сохранить",
			isInputRequired: false,
			onSubmit,
		});

		this.element.append(this.balanceView.render(), this.budgetForm.render());
	}

	render() {
		return this.element;
	}

	update({ endDate, metrics }: TopupBlockUpdate) {
		this.balanceView.update(metrics);

		this.budgetForm.setPeriodDate(endDate);
		this.budgetForm.update();

		return this.element;
	}
}
