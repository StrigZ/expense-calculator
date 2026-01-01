export abstract class BaseView {
	protected element: HTMLElement;
	constructor(element: HTMLElement) {
		this.element = element;
	}

	protected abstract render(...args: unknown[]): void;

	public getElement(): HTMLElement {
		return this.element;
	}
}
