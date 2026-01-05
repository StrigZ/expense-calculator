import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";

export class DatePickerCalendarGridItem extends Component {
	private static template: HTMLTemplateElement | null;
	constructor() {
		if (!DatePickerCalendarGridItem.template) {
			DatePickerCalendarGridItem.template = getTemplateById(
				"date-picker-calendar-grid-item",
			);
		}

		super(cloneTemplate(DatePickerCalendarGridItem.template));
		const button = getElementByQuery("button", this.element);
	}

	render() {
		return this.element;
	}
}
