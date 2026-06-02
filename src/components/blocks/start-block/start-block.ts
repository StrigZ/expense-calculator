import type { StartBlockConstructor } from "../../../types";
import { BudgetForm } from "../../budget-form";
import { Component } from "../../component";
import { Container } from "../../container";

export class StartBlock extends Component {
	constructor({ onSubmit }: StartBlockConstructor) {
		const container = new Container({ className: "card flex flex-col" });

		super(container.render());

		const heading = document.createElement("h1");
		heading.classList.add("text-text-primary");
		heading.textContent = "Начнем!";

		const budgetForm = new BudgetForm({
			isInputRequired: true,
			onSubmit,
		});

		this.element.append(heading, budgetForm.render());
	}

	public render() {
		return this.element;
	}
}
