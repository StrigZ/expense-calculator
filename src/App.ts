import { Router } from "./models/router";
import { StateManager } from "./models/state-manager";
import { HistoryPage } from "./pages/history-page";
import { HomePage } from "./pages/home-page";
import { StartPage } from "./pages/start-page";
import { TopupPage } from "./pages/topup-page";
import { ROUTER_PATHS } from "./types";
import { getElementByQuery } from "./utils/utils";

export function initApp(): void {
	const root = getElementByQuery("#app");

	const state = new StateManager();
	const router = new Router(root);

	const topupPage = new TopupPage({
		onCalculateBudget: ({ budget, periodDate }) => {
			state.increaseBudget(budget);
			state.setPeriodDate(periodDate);

			goToHomePage();
		},
	});
	const historyPage = new HistoryPage({
		goToHomePage,
	});
	const startPage = new StartPage({
		onCalculateBudget: ({ budget, periodDate }) => {
			state.setBudget(budget);
			state.setPeriodDate(periodDate);

			goToHomePage();
		},
	});
	const homePage = new HomePage({
		handleNewTransaction: (transaction) => {
			state.addTransaction(transaction);
			homePage.update(state.getBalanceData());
		},
		goToHistoryPage,
		goToHomePage,
		goToTopupPage,
	});

	router.registerRoute(ROUTER_PATHS.START, startPage.render());
	router.registerRoute(ROUTER_PATHS.HOME, homePage.render());
	router.registerRoute(ROUTER_PATHS.HISTORY, historyPage.render());
	router.registerRoute(ROUTER_PATHS.BALANCE, topupPage.render());
	router.init();

	router.push(state.getBudget() ? "/" : "/start");

	function goToHomePage() {
		homePage.update(state.getBalanceData());
		router.push("/");
	}
	function goToTopupPage() {
		topupPage.update(state.getBalanceData());
		router.push("/balance");
	}
	function goToHistoryPage() {
		historyPage.update(state.getBalanceData());
		router.push("/history");
	}
}
