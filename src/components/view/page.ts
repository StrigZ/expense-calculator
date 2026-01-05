import { Component } from "./component";

export abstract class Page extends Component<HTMLElement | DocumentFragment> {
	constructor(element?: Component["element"]) {
		super(element ?? new DocumentFragment());
	}

	abstract dispose(): void;
}
