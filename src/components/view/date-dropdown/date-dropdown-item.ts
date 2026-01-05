import { format } from "date-fns";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";

export class DateDropdownItem extends Component {
	private static template: HTMLTemplateElement | null;

	private periodEl: HTMLElement;
	private untilDateEl: HTMLElement;
	constructor({ onClick }: { onClick: () => void }) {
		if (!DateDropdownItem.template) {
			const template = getTemplateById("date-dropdown-item");
			DateDropdownItem.template = template;
		}

		super(cloneTemplate(DateDropdownItem.template));

		this.periodEl = getElementByQuery("#period", this.element);
		this.untilDateEl = getElementByQuery("#until-date", this.element);

		this.element.addEventListener("click", onClick);
	}

	render({ untilDate, period }: { period: string; untilDate: Date | null }) {
		this.periodEl.textContent = period;
		if (untilDate) {
			this.untilDateEl.textContent = `до ${format(untilDate, "d MMMM")}`;
		} else {
			this.untilDateEl.classList.add("hidden");
		}

		return this.element;
	}
}
