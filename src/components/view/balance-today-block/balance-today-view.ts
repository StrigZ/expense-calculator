import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";

export class BalanceTodayView extends Component {
	private static template: HTMLTemplateElement | null;

	private availableBalanceEl: HTMLElement;
	private balancePerDayEl: HTMLElement;
	private messageEl: HTMLElement;
	constructor({
		handleNewExpense,
	}: { handleNewExpense: (expense: number) => void }) {
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
		this.balancePerDayEl = getElementByQuery(
			"#balance-per-day",
			balanceTodayBlock,
		);
		this.messageEl = getElementByQuery("#message", balanceTodayBlock);

		const newExpenseForm = getElementByQuery<HTMLFormElement>(
			"#new-expense-form",
			balanceTodayBlock,
		);
		const newExpenseInput = getElementByQuery<HTMLInputElement>(
			"#new-expense-input",
			balanceTodayBlock,
		);

		newExpenseForm.addEventListener("submit", (e) => {
			e.preventDefault();

			handleNewExpense(+newExpenseInput.value);
			newExpenseForm.reset();
		});
	}

	public render({
		availableBalance,
		balancePerDay,
	}: {
		balancePerDay: number;
		availableBalance: number;
	}): void {
		this.availableBalanceEl.textContent = availableBalance.toString();
		this.balancePerDayEl.textContent = balancePerDay.toString();
		this.messageEl.classList.toggle("hidden", availableBalance < 0);
	}
}
