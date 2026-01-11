import { format } from "date-fns";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../utils/utils";
import { Component } from "../component";

export class DatePickerListItem extends Component {
	private static template: HTMLTemplateElement | null;

	constructor({
		untilDate,
		period,
	}: { period: string; untilDate: Date | null }) {
		if (!DatePickerListItem.template) {
			DatePickerListItem.template = getTemplateById("date-picker-list-item");
		}

		super(cloneTemplate(DatePickerListItem.template));

		const periodEl = getElementByQuery("#period", this.element);
		const untilDateEl = getElementByQuery("#until-date", this.element);

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
