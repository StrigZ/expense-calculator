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

	public render() {
		const dateDropdown = new DateDropdown();
		this.dateDropdownPlaceholder.replaceWith(dateDropdown.render());

		return this.element;
	}
}
