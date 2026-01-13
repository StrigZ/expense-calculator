import type { Transaction } from "./models/transaction";
import { HistoryPage } from "./pages/history-page";
import { HomePage } from "./pages/home-page";
import { StartPage } from "./pages/start-page";
import { TopupPage } from "./pages/topup-page";
import { ROUTER_PATHS } from "./types";
import { db } from "./utils/db";
import { Router } from "./utils/router";
import { StateManager } from "./utils/state";
import { getElementByQuery } from "./utils/utils";

export function initApp(): void {
	const root = getElementByQuery("#app");

	const state = new StateManager();
	const router = new Router(root);

	const topupPage = new TopupPage({
		onSubmit: async ({ endDate, inputValue }) => {
			try {
				if (inputValue) {
					const newTransaction: Transaction = {
						amount: inputValue,
						date: new Date(),
						id: crypto.randomUUID(),
						type: "income",
					};
					await state.addTransaction(newTransaction);
				}
				await state.updateEndDate(endDate);
				goToHomePage();
			} catch (error) {
				console.error(error);
			}
		},
	});
	const historyPage = new HistoryPage({
		transactions: state.getTransactions(),
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
		onSubmit: async ({ endDate, inputValue }) => {
			try {
				await state.setInitialBudget({
					initialBalance: inputValue,
					endDate: endDate,
					startDate: new Date(),
				});
				goToHomePage();
			} catch (error) {
				console.error(error);
			}
		},
	});
	const homePage = new HomePage({
		transactions: state.getTransactions(),
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

	db.getBalance().then((budget) => {
		if (!budget) {
			router.push("/start");
			return;
		}

		state.setBudget(budget);
		db.getTransactions().then((transactions) => {
			state.setTransactions(transactions ?? []);
			goToHomePage();
		});
	});

	function goToHomePage() {
		homePage.update({
			transactions: state.getTransactions(),
			metrics: state.getMetrics(),
		});
		router.push("/");
	}
	function goToTopupPage() {
		topupPage.update({
			endDate: state.getBudget()?.endDate,
			metrics: state.getMetrics(),
		});
		router.push("/balance");
	}
	function goToHistoryPage() {
		historyPage.update({
			transactions: state.getTransactions(),
			metrics: state.getMetrics(),
		});
		router.push("/history");
	}
}
