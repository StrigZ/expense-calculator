import {
	cloneTemplate,
	convertTimeframeToDate,
	getTemplateById,
	isTimeframe,
} from "../../utils/utils";
import { Component } from "../component";

export class DatePickerList extends Component {
	private static template: HTMLTemplateElement | null;
	constructor({
		onTimeframePick,
		onCalendarOpen,
	}: {
		onTimeframePick: (pickedDate: Date) => void;
		onCalendarOpen: () => void;
	}) {
		if (!DatePickerList.template) {
			DatePickerList.template = getTemplateById("date-picker-list");
		}

		super(cloneTemplate(DatePickerList.template));

		this.element.addEventListener("click", (e) => {
			e.stopPropagation();
			if (!(e.target instanceof HTMLElement)) return;

			const timeframe = e.target.textContent;
			if (!isTimeframe(timeframe)) return;

			if (timeframe === "Своя дата") {
				onCalendarOpen();
				return;
			}

			onTimeframePick(convertTimeframeToDate(timeframe));
		});
	}

	appendFragmentToList(fragment: DocumentFragment) {
		this.element.append(fragment);
	}
	render() {
		return this.element;
	}
}
