export abstract class BaseView {
	protected element: HTMLElement | DocumentFragment;

	constructor(element?: HTMLElement | DocumentFragment) {
		this.element = element || document.createDocumentFragment();
	}
	protected abstract render(...args: unknown[]): void;

	public getElement(): HTMLElement | DocumentFragment {
		return this.element;
	}
}
