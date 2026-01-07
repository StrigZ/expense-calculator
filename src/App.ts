import { StateManager } from "./models/state-manager";
import { HistoryPage } from "./pages/history-page";
import { HomePage } from "./pages/home-page";
import { StartPage } from "./pages/start-page";
import { TopupPage } from "./pages/topup-page";
import { getElementByQuery } from "./utils/utils";

export function initApp(): void {
	const state = new StateManager();
	const root = getElementByQuery("#app");

	const topupPage = new TopupPage({
		onCalculateBudget: ({ budget, periodDate }) => {
			state.increaseBudget(budget);
			state.setPeriodDate(periodDate);

			// TODO: use router
			root.replaceChildren(homePage.render(state.getBalanceData()));
		},
	});
	const historyPage = new HistoryPage();
	const startPage = new StartPage({
		onCalculateBudget: ({ budget, periodDate }) => {
			state.setBudget(budget);
			state.setPeriodDate(periodDate);

			// TODO: use router
			root.replaceChildren(homePage.render(state.getBalanceData()));
		},
	});
	const homePage = new HomePage({
		handleNewTransaction: (transaction) => {
			state.addTransaction(transaction);
			homePage.render(state.getBalanceData());
		},
		goToHistoryPage: () =>
			root.replaceChildren(historyPage.render(state.getBalanceData())),
		goToTopupPage: () =>
			root.replaceChildren(topupPage.render(state.getBalanceData())),
	});

	// TODO: replace with router
	if (!state.getBudget()) {
		root.replaceChildren(startPage.render());
	} else {
		root.replaceChildren(homePage.render(state.getBalanceData()));
	}
}
