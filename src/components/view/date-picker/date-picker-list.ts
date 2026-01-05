import { cloneTemplate, getTemplateById } from "../../../utils/utils";
import { Component } from "../component";

export class DatePickerList extends Component {
	private static template: HTMLTemplateElement | null;
	constructor() {
		if (!DatePickerList.template) {
			DatePickerList.template = getTemplateById("date-picker-list");
		}

		super(cloneTemplate(DatePickerList.template));
	}

	resetList() {
		this.element.innerHTML = "";
	}
	appendFragmentToList(fragment: DocumentFragment) {
		this.element.append(fragment);
	}
	render() {
		return this.element;
	}
}
