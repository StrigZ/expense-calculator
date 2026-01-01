export function cloneTemplate<T = HTMLElement>(template: HTMLTemplateElement) {
	const clonedTemplate = template.content.cloneNode(
		true,
	) as HTMLTemplateElement;
	const element = clonedTemplate.firstElementChild as T | null;

	if (!element) {
		throw new Error(`Template is empty!`);
	}

	return element;
}

export function getTemplateById(templateId: string) {
	const template = document.querySelector(
		`#${templateId}`,
	) as HTMLTemplateElement | null;
	if (!template) {
		throw new Error(`Template with id ${templateId} was not found!`);
	}

	return template;
}

export function getElementByQuery<T = HTMLElement>(
	query: string,
	parentElement?: Element,
) {
	const parent = parentElement ?? document;
	const element = parent.querySelector(query) as T | null;
	if (!element) {
		throw new Error(
			`Couldn't find an element by query ${query} inside ${parentElement?.id ?? "document"}`,
		);
	}

	return element;
}
