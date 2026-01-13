import { Router } from "./models/router";
import { StateManager } from "./models/state-manager";
import { HistoryPage } from "./pages/history-page";
import { HomePage } from "./pages/home-page";
import { StartPage } from "./pages/start-page";
import { TopupPage } from "./pages/topup-page";
import { calculateBalanceData } from "./services/budget-calculator";
import { ROUTER_PATHS } from "./types";
import { DEFAULT_BALANCE_DATA } from "./utils/constants";
import { DB } from "./utils/db";
import { getElementByQuery } from "./utils/utils";

export function initApp(): void {
	const root = getElementByQuery("#app");

	const state = new StateManager(DEFAULT_BALANCE_DATA);
	const router = new Router(root);
	const db = new DB();

	const topupPage = new TopupPage({
		onCalculateBudget: async ({ budget, periodDate }) => {
			try {
				const updatedBalance = await db.updateBalance((prev) => {
					if (!prev || !prev.budget || !prev.periodDate)
						throw new Error("onCalculateBudget: balance data is undefined!");

					const balanceData = calculateBalanceData({
						budget: prev.budget + budget,
						periodDate,
						transactions: prev.transactions,
					});

					return balanceData;
				});
				state.setBalanceData(updatedBalance);
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
				const updatedBalance = await db.updateBalance((prev) => {
					if (!prev || !prev.budget || !prev.periodDate)
						throw new Error(
							"handleTransactionDelete: balance data is undefined!",
						);

					const balanceData = calculateBalanceData({
						budget: prev.budget,
						periodDate: prev.periodDate,
						transactions: prev.transactions.filter(
							({ id }) => id !== transactionId,
						),
					});

					return balanceData;
				});
				state.setBalanceData(updatedBalance);
				goToHistoryPage();
			} catch (error) {
				console.error(error);
			}
		},
	});
	const startPage = new StartPage({
		onCalculateBudget: async ({ budget, periodDate }) => {
			const balanceData = calculateBalanceData({
				budget,
				periodDate,
				transactions: [],
			});

			try {
				await db.saveBalance(balanceData);
				state.setBalanceData(balanceData);
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
				const updatedBalance = await db.updateBalance((prev) => {
					if (!prev || !prev.budget || !prev.periodDate)
						throw new Error("handleNewTransaction: balance data is undefined!");

					const balanceData = calculateBalanceData({
						budget: prev.budget,
						periodDate: prev.periodDate,
						transactions: [...prev.transactions, transaction],
					});

					return balanceData;
				});

				state.setBalanceData(updatedBalance);
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
