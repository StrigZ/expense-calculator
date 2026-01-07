import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../utils/utils";
import { Component } from "../component";

export class DatePicker extends Component {
	private static template: HTMLTemplateElement | null;

	private boundDocumentClickListener: (e: MouseEvent) => void;
	private boundDocumentKeydownListener: (e: KeyboardEvent) => void;
	private boundTriggerClickListener: (e: MouseEvent) => void;
	private popup: HTMLElement;
	private triggerButtonText: HTMLElement;
	private triggerButton: HTMLButtonElement;
	private isPeriodSelected: boolean = false;

	constructor({ onPopupOpen }: { onPopupOpen: () => void }) {
		if (!DatePicker.template) {
			const template = getTemplateById("date-picker");
			DatePicker.template = template;
		}

		super(cloneTemplate(DatePicker.template));

		this.triggerButton = getElementByQuery<HTMLButtonElement>(
			"#dropdown-trigger-button",
			this.element,
		);
		this.triggerButtonText = getElementByQuery(
			"#dropdown-trigger-text",
			this.element,
		);

		this.popup = getElementByQuery("#date-picker-popup", this.element);

		this.boundDocumentClickListener = (e: MouseEvent) => {
			if (this.element.contains(e.target as Node)) return;

			this.hidePopup();
		};
		this.boundDocumentKeydownListener = (e: KeyboardEvent) => {
			if (e.key !== "Escape") return;

			this.hidePopup();
		};
		this.boundTriggerClickListener = () => {
			this.popup.classList.toggle("hidden");
			// TODO: onPopupOpen triggers even when this callback closes popup
			onPopupOpen();
		};

		this.triggerButton.addEventListener(
			"click",
			this.boundTriggerClickListener,
		);
		document.addEventListener("click", this.boundDocumentClickListener);
		document.addEventListener("keydown", this.boundDocumentKeydownListener);
	}

	render() {
		return this.element;
	}

	dispose() {
		document.removeEventListener("click", this.boundDocumentClickListener);
		document.removeEventListener("keydown", this.boundDocumentKeydownListener);
		this.triggerButton.removeEventListener(
			"click",
			this.boundTriggerClickListener,
		);
	}

	updatePopupContent(content: HTMLElement) {
		this.popup.replaceChildren(content);
	}
	hidePopup() {
		this.popup.classList.add("hidden");
	}

	updateTriggerButtonText(text: string) {
		// If the text updated for the first time
		// update text color too
		if (!this.isPeriodSelected) {
			this.isPeriodSelected = true;
			this.triggerButtonText.classList.add("text-text-primary!");
		}

		this.triggerButtonText.textContent = text;
	}
}
