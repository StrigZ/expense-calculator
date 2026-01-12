import type { InputContsructor } from "../types";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../utils/utils";
import { Component } from "./component";

export class Input extends Component<HTMLLabelElement> {
	private static template: HTMLTemplateElement | null;

	private input: HTMLInputElement;
	constructor({
		labelText,
		placeholderText,
		isRequired,
		type = "text",
		inputMode = "text",
		onChange,
	}: InputContsructor) {
		if (!Input.template) {
			Input.template = getTemplateById("input");
		}
		super(cloneTemplate(Input.template));

		const input = getElementByQuery<HTMLInputElement>("input", this.element);
		const span = getElementByQuery("span", this.element);

		span.textContent = labelText;
		input.placeholder = placeholderText;
		input.type = type;
		input.inputMode = inputMode;
		input.required = isRequired;
		input.addEventListener("change", (e) => {
			onChange(e.target instanceof HTMLInputElement ? e.target.value : "");
		});

		this.input = input;
	}

	setValue(value: string) {
		this.input.value = value;
	}

	render() {
		return this.element;
	}
}
