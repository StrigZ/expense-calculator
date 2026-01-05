import { Component } from "./component";

export class Container<
	T extends keyof HTMLElementTagNameMap = "div",
> extends Component {
	constructor({
		className,
		tag,
	}: {
		tag?: T;
		className: string;
	}) {
		const element = document.createElement(tag ?? "div");
		element.className = className;
		super(element);
	}

	render() {
		return this.element;
	}
}
