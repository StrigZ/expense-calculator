import { Router } from "./models/router";
import { StateManager } from "./models/state-manager";
import { HistoryPage } from "./pages/history-page";
import { HomePage } from "./pages/home-page";
import { StartPage } from "./pages/start-page";
import { TopupPage } from "./pages/topup-page";
import { calculateBalanceData } from "./services/budget-calculator";
import { ROUTER_PATHS } from "./types";
import { DEFAULT_BALANCE_DATA } from "./utils/constants";
import { db } from "./utils/db";
import { getElementByQuery } from "./utils/utils";

export function initApp(): void {
	const root = getElementByQuery("#app");

	const state = new StateManager(DEFAULT_BALANCE_DATA);
	const router = new Router(root);

	const topupPage = new TopupPage({
		onCalculateBudget: async ({ budget, periodDate }) => {
			const balanceData = state.getBalanceData();
			if (balanceData.budget === null || !balanceData.periodDate)
				throw new Error("onCalculateBudget: balance data is undefined!");

			const newBalanceData = calculateBalanceData({
				budget: balanceData.budget + budget,
				periodDate,
				transactions: balanceData.transactions,
			});
			try {
				await state.setBalanceData(newBalanceData);
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
			const balanceData = state.getBalanceData();
			if (balanceData.budget === null || !balanceData.periodDate)
				throw new Error("handleTransactionDelete: balance data is undefined!");

			const transactions = balanceData.transactions;
			const deletedTransactionIdx = transactions.findIndex(
				({ id }) => id === transactionId,
			);

			if (deletedTransactionIdx === -1) return;
			const deletedTransaction = transactions[deletedTransactionIdx];

			const newBalanceData = calculateBalanceData({
				budget: balanceData.budget + deletedTransaction.amount,
				periodDate: balanceData.periodDate,
				transactions: balanceData.transactions.filter(
					({ id }) => id !== transactionId,
				),
			});

			try {
				await state.setBalanceData(newBalanceData);
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
				await state.setBalanceData(balanceData);
				goToHomePage();
			} catch (error) {
				console.error(error);
			}
		},
	});
	const homePage = new HomePage({
		balanceData: state.getBalanceData(),
		handleNewTransaction: async (transaction) => {
			const balanceData = state.getBalanceData();
			if (balanceData.budget === null || !balanceData.periodDate) return;

			const newBalanceData = calculateBalanceData({
				budget: balanceData.budget,
				periodDate: balanceData.periodDate,
				transactions: [...balanceData.transactions, transaction],
			});

			try {
				await state.setBalanceData(newBalanceData);
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
			state.setBalanceData(balance).then(() => goToHomePage());
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
