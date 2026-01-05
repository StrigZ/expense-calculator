import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";

export class DatePickerCalendar extends Component {
	private static template: HTMLTemplateElement | null;
	constructor() {
		if (!DatePickerCalendar.template) {
			DatePickerCalendar.template = getTemplateById("date-picker-calendar");
		}

		super(cloneTemplate(DatePickerCalendar.template));

		const calendarGrid = getElementByQuery("#calendar-grid", this.element);
	}

	render() {
		return this.element;
	}
}
