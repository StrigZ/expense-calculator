import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";
import { DateDropdown } from "../date-dropdown/date-dropdown";

export class StartView extends Component {
	private static template: HTMLTemplateElement | null;

	private dateDropdownPlaceholder: HTMLElement;
	constructor() {
		if (!StartView.template) {
			const template = getTemplateById("start-block");
			StartView.template = template;
		}

		const startBlock = cloneTemplate(StartView.template);
		super(startBlock);

		this.dateDropdownPlaceholder = getElementByQuery(
			"#date-dropdown-placeholder",
			startBlock,
		);
	}

	public render(): void {
		const dateDropdown = new DateDropdown();
		dateDropdown.render();
		this.dateDropdownPlaceholder.replaceWith(dateDropdown.getElement());
	}
}
