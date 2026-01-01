export class Container<T extends keyof HTMLElementTagNameMap = "div"> {
	private element: HTMLElementTagNameMap[T];
	constructor({
		className,
		tag,
	}: {
		tag: T;
		className: string;
	}) {
		const element = document.createElement(tag);
		element.className = className;

		this.element = element;
	}

	public getElement(): HTMLElementTagNameMap[T] {
		return this.element;
	}
}
