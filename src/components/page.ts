import { Component } from "./component";

export abstract class Page<
	T extends HTMLElement | DocumentFragment = HTMLElement,
> extends Component<T> {}
