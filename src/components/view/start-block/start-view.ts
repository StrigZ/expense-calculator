import { cloneTemplate, getTemplateById } from "../../../utils/utils";
import { BaseView } from "../base-view";

export class StartView extends BaseView {
	private static template: HTMLTemplateElement | null;

	constructor() {
		if (!StartView.template) {
			const template = getTemplateById("start-block");
			StartView.template = template;
		}

		const startBlock = cloneTemplate(StartView.template);
		super(startBlock);
	}

	public render(): void {}
}
