import { format } from "date-fns";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../utils/utils";
import { Component } from "../component";

export class DatePickerListItem extends Component {
	private static template: HTMLTemplateElement | null;

	private timeframeEl: HTMLElement;
	private untilDateEl: HTMLElement;
	constructor({
		untilDate,
		timeframe,
	}: { timeframe: string; untilDate: Date | null }) {
		if (!DatePickerListItem.template) {
			DatePickerListItem.template = getTemplateById("date-picker-list-item");
		}

		super(cloneTemplate(DatePickerListItem.template));

		this.timeframeEl = getElementByQuery("#period", this.element);
		this.untilDateEl = getElementByQuery("#until-date", this.element);

		if (untilDate) {
			this.untilDateEl.textContent = `до ${format(untilDate, "d MMMM")}`;
		} else {
			this.untilDateEl.classList.add("hidden");
		}
		this.timeframeEl.textContent = timeframe;
	}

	getTimeframe() {
		return this.timeframeEl.textContent;
	}

	setUntilDate(untilDate: Date | null) {
		if (!untilDate) return;

		this.untilDateEl.textContent = `до ${format(untilDate, "d MMMM")}`;
	}

	render() {
		return this.element;
	}
}
