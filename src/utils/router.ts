import type { Page } from "../components/page";
import type { Route } from "../types";

export class Router {
	routes = {} as Record<Route, Page["element"]>;

	private root: HTMLElement;
	constructor(root: HTMLElement) {
		this.root = root;
	}

	public registerRoute(route: Route, pageEl: Page["element"]) {
		this.routes[route] = pageEl;
	}

	public push(route: Route) {
		history.pushState({ route }, "", route);
		this.renderPage(this.routes[route]);
	}

	private renderPage(template: Page["element"]) {
		this.root.innerHTML = "";

		this.root.append(template);
	}
}
