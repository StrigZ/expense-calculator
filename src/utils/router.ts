import type { Component } from "../components/component";
import type { Route } from "../types";

export class Router {
	routes = {} as Record<Route, Component["element"]>;

	private root: HTMLElement;
	constructor(root: HTMLElement) {
		this.root = root;
	}

	public registerRoute(route: Route, pageEl: Component["element"]) {
		this.routes[route] = pageEl;
	}

	public push(route: Route) {
		history.pushState({ route }, "", route);
		this.renderPage(this.routes[route]);
	}

	private renderPage(template: Component["element"]) {
		this.root.innerHTML = "";

		this.root.append(template);
	}
}
