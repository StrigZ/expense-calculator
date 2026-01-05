export abstract class Component<
	T extends HTMLElement | DocumentFragment = HTMLElement,
> {
	protected element: T;

	constructor(element: T) {
		this.element = element;
	}
	protected abstract render(...args: unknown[]): void;

	public getElement(): T {
		return this.element;
	}
}
