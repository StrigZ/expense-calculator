import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";

export class DateDropdown extends Component {
	private static template: HTMLTemplateElement | null;

	private boundDocumentClickListener: (e: MouseEvent) => void;
	private boundDocumentKeydownListener: (e: KeyboardEvent) => void;
	private boundTriggerClickListener: (e: MouseEvent) => void;
	private list: HTMLUListElement;
	private triggerButtonText: HTMLElement;
	private triggerButton: HTMLButtonElement;
	private isPeriodSelected: boolean = false;

	constructor() {
		if (!DateDropdown.template) {
			const template = getTemplateById("date-dropdown");
			DateDropdown.template = template;
		}

		super(cloneTemplate(DateDropdown.template));

		this.triggerButton = getElementByQuery<HTMLButtonElement>(
			"#dropdown-trigger-button",
			this.element,
		);
		this.triggerButtonText = getElementByQuery(
			"#dropdown-trigger-text",
			this.element,
		);
		this.list = getElementByQuery("ul", this.element);

		this.boundDocumentClickListener = (e: MouseEvent) => {
			if (!this.element.contains(e.target as Node)) {
				this.hideList();
			}
		};
		this.boundDocumentKeydownListener = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				this.hideList();
			}
		};
		this.boundTriggerClickListener = () => {
			this.list.classList.toggle("hidden");
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

	hideList() {
		this.list.classList.add("hidden");
	}
	resetList() {
		this.list.innerHTML = "";
	}
	appendFragmentToList(fragment: DocumentFragment) {
		this.list.append(fragment);
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
