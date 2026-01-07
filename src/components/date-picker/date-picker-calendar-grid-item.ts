import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../utils/utils";
import { Component } from "../component";

export class DatePickerCalendarGridItem extends Component {
	private static template: HTMLTemplateElement | null;
	constructor({
		content,
		isDisabled,
		// TODO: add isActive state to show selected date
		// isActive
	}: { content: string; isDisabled: boolean }) {
		if (!DatePickerCalendarGridItem.template) {
			DatePickerCalendarGridItem.template = getTemplateById(
				"date-picker-calendar-grid-item",
			);
		}

		super(cloneTemplate(DatePickerCalendarGridItem.template));

		const button = getElementByQuery<HTMLButtonElement>("button", this.element);

		button.textContent = content;
		button.disabled = isDisabled;
	}

	render() {
		return this.element;
	}
}
