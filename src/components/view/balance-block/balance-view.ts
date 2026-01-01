import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { BaseView } from "../base-view";

export class BalanceView extends BaseView {
	public static balanceBlockTemplate: HTMLTemplateElement | null;

	private balancePerDayEl: HTMLElement;
	private periodEl: HTMLElement;
	private totalBalanceEl: HTMLElement;
	constructor() {
		if (!BalanceView.balanceBlockTemplate) {
			const balanceBlock = getTemplateById("balance-block");
			BalanceView.balanceBlockTemplate = balanceBlock;
		}

		const balanceBlock = cloneTemplate(BalanceView.balanceBlockTemplate);
		super(balanceBlock);

		this.balancePerDayEl = getElementByQuery("#balance-per-day", balanceBlock);
		this.periodEl = getElementByQuery("#period", balanceBlock);
		this.totalBalanceEl = getElementByQuery("#total-balance", balanceBlock);
	}

	public render({
		balancePerDay,
		period,
		totalBalance,
	}: {
		totalBalance: number;
		period: number;
		balancePerDay: number;
	}): void {
		this.balancePerDayEl.textContent = balancePerDay.toString();
		this.periodEl.textContent = period.toString();
		this.totalBalanceEl.textContent = totalBalance.toString();
	}
}
