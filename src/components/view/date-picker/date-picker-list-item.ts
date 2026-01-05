import { format } from "date-fns";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";

export class DatePickerListItem extends Component {
	private static template: HTMLTemplateElement | null;

	constructor({
		untilDate,
		period,
		onClick,
	}: { period: string; untilDate: Date | null; onClick: () => void }) {
		if (!DatePickerListItem.template) {
			const template = getTemplateById("date-picker-list-item");
			DatePickerListItem.template = template;
		}

		super(cloneTemplate(DatePickerListItem.template));

		const periodEl = getElementByQuery("#period", this.element);
		const untilDateEl = getElementByQuery("#until-date", this.element);

		this.element.addEventListener("click", (e) => {
			e.stopPropagation();
			onClick();
		});

		if (untilDate) {
			untilDateEl.textContent = `до ${format(untilDate, "d MMMM")}`;
		} else {
			untilDateEl.classList.add("hidden");
		}
		periodEl.textContent = period;
	}

	render() {
		return this.element;
	}
}
