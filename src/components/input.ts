import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../utils/utils";
import { Component } from "./view/component";

export class Input extends Component {
	private static template: HTMLTemplateElement | null;

	constructor({
		labelText,
		placeholderText,
		isRequired,
		type,
		onChange,
	}: {
		labelText: string;
		placeholderText: string;
		isRequired: boolean;
		type: "text" | "number";
		onChange: (value: string) => void;
	}) {
		if (!Input.template) {
			Input.template = getTemplateById("input");
		}
		super(cloneTemplate(Input.template));

		const input = getElementByQuery<HTMLInputElement>("input", this.element);
		const span = getElementByQuery("span", this.element);

		span.textContent = labelText;
		input.placeholder = placeholderText;
		input.type = type;
		input.required = isRequired;
		input.addEventListener("change", (e) => {
			onChange(e.target instanceof HTMLInputElement ? e.target.value : "");
		});
	}

	render() {
		return this.element;
	}
}
