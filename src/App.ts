import { HistoryPage } from "./pages/history-page";
import { HomePage } from "./pages/home-page";
import { StartPage } from "./pages/start-page";
import { TopupPage } from "./pages/topup-page";
import { ROUTER_PATHS } from "./types";
import { DEFAULT_BALANCE_DATA } from "./utils/constants";
import { db } from "./utils/db";
import { Router } from "./utils/router";
import { StateManager } from "./utils/state";
import { getElementByQuery } from "./utils/utils";

export function initApp(): void {
	const root = getElementByQuery("#app");

	const state = new StateManager(DEFAULT_BALANCE_DATA);
	const router = new Router(root);

	const topupPage = new TopupPage({
		onCalculateBudget: async (newBalanceData) => {
			try {
				await state.updateBalance(newBalanceData);
				goToHomePage();
			} catch (error) {
				console.error(error);
			}
		},
	});
	const historyPage = new HistoryPage({
		balanceData: state.getBalanceData(),
		goToHomePage,
		handleTransactionDelete: async (transactionId) => {
			try {
				await state.deleteTransaction(transactionId);
				goToHistoryPage();
			} catch (error) {
				console.error(error);
			}
		},
	});
	const startPage = new StartPage({
		onCalculateBudget: async (balanceData) => {
			try {
				await state.setInitialBudget(balanceData);
				goToHomePage();
			} catch (error) {
				console.error(error);
			}
		},
	});
	const homePage = new HomePage({
		balanceData: state.getBalanceData(),
		handleNewTransaction: async (transaction) => {
			try {
				await state.addTransaction(transaction);
				goToHomePage();
			} catch (error) {
				console.error(error);
			}
		},
		goToHistoryPage,
		goToHomePage,
		goToTopupPage,
	});

	router.registerRoute(ROUTER_PATHS.START, startPage.render());
	router.registerRoute(ROUTER_PATHS.HOME, homePage.render());
	router.registerRoute(ROUTER_PATHS.HISTORY, historyPage.render());
	router.registerRoute(ROUTER_PATHS.BALANCE, topupPage.render());

	db.getBalance().then((balance) => {
		if (balance) {
			state.setBalanceData(balance);
			goToHomePage();
			return;
		}
		router.push("/start");
	});

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
