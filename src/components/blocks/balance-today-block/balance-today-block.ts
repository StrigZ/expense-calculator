import type { BalanceTodayBlockRender, Transaction } from "../../../types";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../../component";

// TOOD: add type to imlement
export class BalanceTodayBlock extends Component {
	private static template: HTMLTemplateElement | null;

	private availableBalanceEl: HTMLElement;
	private availableBalanceValueEl: HTMLElement;
	private balancePerDayEl: HTMLElement;
	private messageEl: HTMLElement;
	constructor({
		handleNewTransaction,
	}: { handleNewTransaction: (transaction: Transaction) => void }) {
		if (!BalanceTodayBlock.template) {
			BalanceTodayBlock.template = getTemplateById("balance-today-block");
		}

		super(cloneTemplate(BalanceTodayBlock.template));

		this.availableBalanceEl = getElementByQuery(
			"#available-balance",
			this.element,
		);
		this.availableBalanceValueEl = getElementByQuery(
			"#available-balance-value",
			this.element,
		);
		this.balancePerDayEl = getElementByQuery("#balance-per-day", this.element);
		this.messageEl = getElementByQuery("#message", this.element);

		const newTransactionForm = getElementByQuery<HTMLFormElement>(
			"#new-transaction-form",
			this.element,
		);
		const newTransactionInput = getElementByQuery<HTMLInputElement>(
			"#new-transaction-input",
			this.element,
		);

		newTransactionForm.addEventListener("submit", (e) => {
			e.preventDefault();

			handleNewTransaction({
				id: crypto.randomUUID(),
				amount: +newTransactionInput.value,
				date: new Date(),
			});
			newTransactionForm.reset();
		});
	}

	public render({
		availableBudgetToday,
		budgetPerDay,
	}: BalanceTodayBlockRender) {
		if (availableBudgetToday === null) {
			throw new Error(`${this}: availableBudgetToday is null`);
		}

		if (availableBudgetToday >= 0) {
			this.availableBalanceEl.classList.remove("text-error");
			this.availableBalanceEl.classList.add("text-success");
		} else {
			this.availableBalanceEl.classList.remove("text-success");
			this.availableBalanceEl.classList.add("text-error");
		}

		this.availableBalanceValueEl.textContent =
			availableBudgetToday?.toString() ?? "";
		this.balancePerDayEl.textContent = budgetPerDay?.toString() ?? "";
		this.messageEl.classList.toggle("hidden", availableBudgetToday < 0);

		return this.element;
	}
}
