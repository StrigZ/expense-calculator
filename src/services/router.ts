import type { Page } from "../components/page";
import { isRoute, ROUTER_PATHS, type Route } from "./routes";

export class Router {
	routes = {} as Record<Route, Page["element"]>;

	private root: HTMLElement;
	constructor(root: HTMLElement) {
		this.root = root;
	}

	public init() {
		window.addEventListener("popstate", (e) => {
			e.preventDefault();

			this.goTo(e.state.str, false);
		});

		this.goTo(location.pathname);
	}

	public registerRoute(route: Route, pageEl: Page["element"]) {
		this.routes[route] = pageEl;
	}

	public push(route: Route) {
		history.pushState({ route }, "", route);
		this.renderPage(this.routes[route]);
	}

	private goTo(str: string, addHistory = true) {
		if (!isRoute(str)) {
			const errorPage =
				this.routes[ROUTER_PATHS.NOT_FOUND] ?? document.createElement("h1");

			if (!errorPage.innerHTML) {
				errorPage.textContent = "NOT FOUND";
			}

			return this.renderPage(errorPage);
		}

		if (addHistory) {
			history.pushState({ str }, "", str);
		}

		const template = this.routes[str];

		this.renderPage(template);
	}

	private renderPage(template: Page["element"]) {
		this.root.innerHTML = "";

		this.root.append(template);
	}
}
