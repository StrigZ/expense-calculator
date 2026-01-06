import type { BalanceTodayBlockRender, Transaction } from "../../../types";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";

// TOOD: add type to imlement
export class BalanceTodayView extends Component {
	private static template: HTMLTemplateElement | null;

	private availableBalanceEl: HTMLElement;
	private availableBalanceValueEl: HTMLElement;
	private balancePerDayEl: HTMLElement;
	private messageEl: HTMLElement;
	constructor({
		handleNewTransaction,
	}: { handleNewTransaction: (transaction: Transaction) => void }) {
		if (!BalanceTodayView.template) {
			const template = getTemplateById("balance-today-block");
			BalanceTodayView.template = template;
		}

		const balanceTodayBlock = cloneTemplate(BalanceTodayView.template);
		super(balanceTodayBlock);

		this.availableBalanceEl = getElementByQuery(
			"#available-balance",
			balanceTodayBlock,
		);
		this.availableBalanceValueEl = getElementByQuery(
			"#available-balance-value",
			balanceTodayBlock,
		);
		this.balancePerDayEl = getElementByQuery(
			"#balance-per-day",
			balanceTodayBlock,
		);
		this.messageEl = getElementByQuery("#message", balanceTodayBlock);

		const newTransactionForm = getElementByQuery<HTMLFormElement>(
			"#new-transaction-form",
			balanceTodayBlock,
		);
		const newTransactionInput = getElementByQuery<HTMLInputElement>(
			"#new-transaction-input",
			balanceTodayBlock,
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
		if (availableBudgetToday && availableBudgetToday > 0) {
			this.availableBalanceEl.classList.remove("text-error");
			this.availableBalanceEl.classList.add("text-success");
		} else {
			this.availableBalanceEl.classList.remove("text-success");
			this.availableBalanceEl.classList.add("text-error");
		}

		this.availableBalanceValueEl.textContent =
			availableBudgetToday?.toString() ?? "";
		this.balancePerDayEl.textContent = budgetPerDay?.toString() ?? "";
		this.messageEl.classList.toggle(
			"hidden",
			availableBudgetToday ? availableBudgetToday < 0 : false,
		);

		return this.element;
	}
}
