import { Component } from "./component";

export abstract class Page<
	T extends HTMLElement | DocumentFragment = HTMLElement,
> extends Component<T> {
	// Method to remove all listeners before unloading page
	abstract dispose(): void;
}
