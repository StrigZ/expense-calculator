import type { ContainerConstructor } from "../types";
import { Component } from "./component";

export class Container<
	T extends HTMLElement = HTMLDivElement,
> extends Component<T> {
	constructor({ className, tag = "div" }: ContainerConstructor) {
		const element = document.createElement(tag);
		if (className) {
			element.className = className;
		}
		super(element as T);
	}

	override render(): T {
		return this.element;
	}
}
